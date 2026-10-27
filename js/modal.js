
// ========================================
// 作品詳細モーダル（画像・動画対応）
// ========================================

(() => {
  const $ = id => document.getElementById(id);
  const overlay = $("overlay");
  if (!overlay) return;

  let workIndex = 0;
  let photoIndex = 0;
  let returnFocus = null;

  const current = () => window.works[workIndex];

  // media があれば優先。なければ従来の images を使う
  function getMedia() {
    const work = current();
    $("main-photo").style.aspectRatio = work.modalRatio || "822 / 460";

    if (Array.isArray(work.media) && work.media.length > 0) {
      return work.media;
    }

    if (Array.isArray(work.images) && work.images.length > 0) {
      return work.images.map(src => ({
        type: "image",
        src
      }));
    }

    return Array.from(
      { length: Math.max(work.colors?.length || 0, 1) },
      (_, index) => ({
        type: "placeholder",
        index
      })
    );
  }

  const count = () => getMedia().length;

  // 再生中の動画を停止
  function stopVideos() {
    overlay.querySelectorAll("video").forEach(video => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }

  // 画像・動画・仮画像を表示
  function paint(target, index, label, isMain = false) {
    const work = current();
    const item = getMedia()[index];

    target.replaceChildren();
    target.style.background = "var(--cream)";

    if (item.type === "image") {
      const img = document.createElement("img");

      img.src = item.src;
      img.alt = work.title + " " + (index + 1);

      if (isMain) {
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.minWidth = "0";
        img.style.minHeight = "0";
        img.style.objectFit = item.fit || "contain";
        img.style.objectPosition = item.position || "center center";
      }

      target.append(img);

    } else if (item.type === "youtube") {
      if (isMain) {
        const iframe = document.createElement("iframe");

        iframe.src =
          "https://www.youtube-nocookie.com/embed/" +
          encodeURIComponent(item.videoId);

        iframe.title = work.title + " の動画";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;

        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";

        target.append(iframe);
      } else if (item.thumbnail) {
        const img = document.createElement("img");
        img.src = item.thumbnail;
        img.alt = work.title + " 動画サムネイル";
      } else {
        target.textContent = "▶ YouTube";
      }


    } else if (item.type === "video") {
      if (isMain) {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", work.title + " の動画");
        video.addEventListener("click", event => {
          event.stopPropagation();
        });
        video.addEventListener("keydown", event => {
          event.stopPropagation();
        });
        target.append(video);
      } else {
        if (item.thumbnail) {
          const img = document.createElement("img");
          img.src = item.thumbnail;
          img.alt = work.title + " 動画サムネイル";
          target.append(img);
        } else {
          const mark = document.createElement("span");
          mark.className = "video-thumb-mark";
          mark.textContent = "▶ VIDEO";
          target.append(mark);
        }
      }
    } else {
      const colors = work.colors || ["#4f6045"];
      target.style.background =
        colors[index % colors.length];
      target.textContent = label;
    }
  }

  function render() {

    const total = count();

    // メイン画像・動画を更新
    stopVideos();

    const item = getMedia()[photoIndex];
    const mainPhoto = $("main-photo");

    paint(
      mainPhoto,
      photoIndex,
      "IMAGE " + (photoIndex + 1),
      true
    );

const credit = document.getElementById("photo-credit");
if (credit) {
  credit.textContent = item.credit || "";
  credit.style.display = item.credit ? "block" : "none";
}

    const isVideo = item.type === "video" || item.type === "youtube";

    mainPhoto.style.cursor =
      isVideo ? "default" : "zoom-in";

    mainPhoto.setAttribute(
      "tabindex",
      isVideo ? "-1" : "0"
    );

    $("photo-count").textContent =
      (photoIndex + 1) + " / " + total;

    // 下のサムネイルは最大3枚
    const thumbs = $("thumbs");
    thumbs.replaceChildren();

    const visibleCount = Math.min(3, total);

    for (let offset = 0; offset < visibleCount; offset++) {

      const i = (photoIndex + offset) % total;

      const button = document.createElement("button");

      button.type = "button";
      button.className =
        "thumb" + (i === photoIndex ? " active" : "");

      const mediaItem = getMedia()[i];

      button.setAttribute(
        "aria-label",
        (mediaItem.type === "video" || mediaItem.type === "youtube"
          ? "動画 "
          : "画像 ") + (i + 1)
      );
      paint(
        button,
        i,
        "IMAGE " + (i + 1)
      );

      button.onclick = () => {
        photoIndex = i;
        render();
      };

      thumbs.append(button);
    }
  }
  function open(index) {
    returnFocus = document.activeElement;

    workIndex = index;
    photoIndex = 0;

    const work = current();

    $("category").textContent = work.category;
    $("modal-title").textContent = work.title;
    $("description").textContent = work.description;
    $("tools").textContent =
      "tools / " + work.tools.join(" / ");

    render();

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    $("close").focus();
  }

  function close() {
    if (!overlay.classList.contains("open")) return;

    stopVideos();

    overlay.querySelectorAll("iframe").forEach(iframe => {
      iframe.remove();
    });

    $("image-zoom").classList.remove("open");
    overlay.classList.remove("open");

    document.body.style.overflow = "";

    if (returnFocus) returnFocus.focus();
  }

  function move(direction) {
    photoIndex =
      (photoIndex + direction + count()) % count();
    render();
  }

  $("close").onclick = close;
  $("prev").onclick = () => move(-1);
  $("next-photo").onclick = () => move(1);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) close();
  });

  // 画像の拡大表示
  function openZoom() {
    const item = getMedia()[photoIndex];


    // 動画は拡大画面を開かない
    if (item.type === "video" || item.type === "youtube") return;

    const zoom = $("image-zoom");
    zoom.replaceChildren();

    if (item.type === "image") {
      const img = document.createElement("img");
      img.className = "zoomed-image";
      img.src = item.src;
      img.alt = current().title;
      zoom.append(img);
    } else {
      const panel = document.createElement("div");
      panel.className = "zoom-placeholder";

      const colors = current().colors || ["#4f6045"];
      panel.style.background =
        colors[photoIndex % colors.length];

      panel.textContent = "IMAGE " + (photoIndex + 1);
      zoom.append(panel);
    }

    zoom.classList.add("open");
  }

  $("main-photo").onclick = event => {
    if (event.target.closest("video")) return;
    openZoom();
  };

  $("main-photo").addEventListener("keydown", event => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !["video", "youtube"].includes(getMedia()[photoIndex].type)) {
      event.preventDefault();
      openZoom();
    }
  });

  $("image-zoom").onclick = () => {
    $("image-zoom").classList.remove("open");
  };

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if ($("image-zoom").classList.contains("open")) {
        $("image-zoom").classList.remove("open");
      } else {
        close();
      }
      return;
    }

    if (
      overlay.classList.contains("open") &&
      !$("image-zoom").classList.contains("open")
    ) {
      // 動画操作中は左右キーを奪わない
      if (event.target.closest("video")) return;

      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);

      if (event.key === "Tab") {
        const controls = [
          ...overlay.querySelectorAll(
            "button, [tabindex='0'], video[controls]"
          )
        ].filter(element => element.offsetParent !== null);

        if (controls.length) {
          const first = controls[0];
          const last = controls[controls.length - 1];

          if (
            event.shiftKey &&
            document.activeElement === first
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }
  });

  window.openWorkModal = open;
})();
