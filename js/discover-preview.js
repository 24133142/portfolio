// 診断ツール：制作中プレビュー
(() => {
  const trigger = document.getElementById("discover-preview-trigger");
  const preview = document.getElementById("discover-preview");

  if (!trigger || !preview) return;

  const dialog = preview.querySelector(".discover-preview-card");
  const closeButton = preview.querySelector(".discover-preview-close");
  const backButton = preview.querySelector(".discover-preview-back");

  function openPreview(event) {
    event.preventDefault();

    preview.classList.add("is-open");
    preview.setAttribute("aria-hidden", "false");

    dialog.focus();
  }

  function closePreview() {
    preview.classList.remove("is-open");
    preview.setAttribute("aria-hidden", "true");

    trigger.focus();
  }

  trigger.addEventListener("click", openPreview);
  closeButton.addEventListener("click", closePreview);
  backButton.addEventListener("click", closePreview);

  preview.addEventListener("click", event => {
    if (event.target === preview) {
      closePreview();
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      preview.classList.contains("is-open")
    ) {
      closePreview();
    }
  });
})();