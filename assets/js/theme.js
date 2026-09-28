// Light/dark theme. Loaded in <head> so the saved theme is applied before the
// page renders (no flash of the wrong colours). Uses Bootstrap's data-bs-theme
// attribute, so Bootstrap's own components switch too.
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.innerHTML = theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    button.setAttribute("aria-pressed", theme === "dark");
    button.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }
};

const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(Store.getTheme() || (prefersDark ? "dark" : "light"));

// The toggle button is part of the header that nav.js renders, so wire it up
// once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(document.documentElement.getAttribute("data-bs-theme"));
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  button.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    Store.setTheme(next);
    applyTheme(next);
    document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  });
});
