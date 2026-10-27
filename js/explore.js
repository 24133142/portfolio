
// ========================================
// FIND BY SOFTWARE
// ========================================

// フィルターに表示するソフトウェア
const filterNames = [
  "ALL WORKS",
  "Illustrator",
  "aftereffects",
  "aibisPaint",
  "Photoshop",
  "Blender",
  "Python",
  "AutoCAD",
  "Unreal Engine",
  "Craft"
];

// 現在選択されているフィルター
let activeFilter = "ALL WORKS";

const filters = document.getElementById("filters");
const grid = document.getElementById("work-grid");

// ========================================
// フィルターの表示
// ========================================

function renderFilters() {

  filters.replaceChildren();

  filterNames.forEach(name => {

    const button = document.createElement("button");

    button.className =
      "pill" +
      (name === activeFilter ? " active" : "");

    button.textContent = name;

    // フィルター選択
    button.onclick = () => {

      activeFilter = name;

      renderFilters();
      renderWorks();
    };

    filters.append(button);
  });
}

// ========================================
// 作品一覧の表示
// ========================================

function renderWorks() {

  grid.replaceChildren();

  document.getElementById("works-label").textContent =
    activeFilter.toUpperCase() + " / 作品一覧";

  window.works.forEach((work, index) => {

    // 選択中のソフトが使われていなければ非表示
    if (
      activeFilter !== "ALL WORKS" &&
      !work.tools.includes(activeFilter)
    ) {
      return;
    }

    // 作品カード
    const button = document.createElement("button");

    button.className = "work-card";

// 作品画像
const cover = document.createElement("div");

cover.className = "work-cover";
cover.style.background = work.colors[0];

// サムネイル画像を取得
const coverSrc =
  work.thumbnail ||
  work.media?.[0]?.thumbnail ||
  work.images?.[0];

if (coverSrc) {

  const img = document.createElement("img");

  img.src = coverSrc;
  img.alt = work.title;

  cover.append(img);

} else {

  cover.textContent =
    "IMAGE / " +
    String(index + 1).padStart(2, "0");
}
    // 作品タイトル
    const title = document.createElement("div");

    title.className = "work-title";
    title.textContent = work.title;

    button.append(cover, title);

    // クリックで作品詳細を開く
    button.onclick = () => {
      window.openWorkModal(index);
    };

    grid.append(button);
  });
}

// ========================================
// 初期表示
// ========================================

renderFilters();
renderWorks();
