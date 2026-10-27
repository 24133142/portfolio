document.addEventListener("DOMContentLoaded", () => {
  const exploreCard = document.querySelector(
    'a[href="explore.html"]'
  );

  const ticket = document.querySelector(
    ".ticket-illustration"
  );

  if (!exploreCard || !ticket) return;

  let navigating = false;

  exploreCard.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    if (navigating) {
      event.preventDefault();
      return;
    }

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) return;

    event.preventDefault();
    navigating = true;

    ticket.classList.add("tearing");

    setTimeout(() => {
      window.location.href = exploreCard.href;
    }, 850);
  });
});