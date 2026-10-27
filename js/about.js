
(() => {
  const aboutLink = document.getElementById("about-toggle");
  if (!aboutLink) return;

  const panel = document.createElement("aside");
  panel.className = "about-panel";
  panel.id = "about-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("aria-label", "ABOUT");

panel.innerHTML = `
  <div class="container about">

    <div class="portrait">
<img src="images/profile/profile.webp" alt="プロフィール写真">    </div>

    <div class="about-info">
      <p class="school">安田女子大学 造形デザイン学科 2028卒見込み</p>

      <h1 class="name">安富 愛佳</h1>
      <h1 class="name-romaji">Aika Yasutomi</h1>

      <p class="bio">
        グラフィックデザイン、3D、CAD、映像、
        プログラミング、ゲーム制作など、
        さまざまな表現を学びながら
        自分だけの表現方法を模索しています。
      </p>
    </div>

  </div>
`;
  document.body.append(panel);

  let isOpen = false;

  function toggleAbout() {
    isOpen = !isOpen;

    panel.classList.toggle("open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));

    aboutLink.classList.toggle("about-active", isOpen);
    aboutLink.setAttribute("aria-expanded", String(isOpen));

    aboutLink.textContent = isOpen ? "ABOUT ×" : "ABOUT";

    document.body.classList.toggle("about-open", isOpen);
  }

  aboutLink.setAttribute("aria-controls", "about-panel");
  aboutLink.setAttribute("aria-expanded", "false");

  aboutLink.addEventListener("click", event => {
    event.preventDefault();
    toggleAbout();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen) {
      toggleAbout();
      aboutLink.focus();
    }
  });
})();
