// Light/dark theme toggle for the quiz page. The choice is remembered.
const themeToggle = document.getElementById("theme-toggle");

// Check for saved theme preference
const savedTheme = Store.getTheme();
if (savedTheme) {
  document.body.classList.toggle("dark-mode", savedTheme === "dark");
  themeToggle.checked = savedTheme === "dark";
}

// Toggle theme and save preference
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
  Store.setTheme(themeToggle.checked ? "dark" : "light");
});
