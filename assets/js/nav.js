// Renders the shared site header into #site-header: brand, page links, theme
// toggle, and either Login/Sign Up buttons or the user's name with a Logout button.
(() => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const currentPage = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["index.html", "Home"],
    ["quiz.html", "Play Quiz"],
    ["scorecard.html", "Scorecard"],
  ];

  header.innerHTML = `
    <nav class="navbar navbar-expand-md site-nav" data-bs-theme="dark">
      <div class="container">
        <a class="navbar-brand" href="index.html" aria-label="Quizverse home">
          <img class="brand-logo" src="assets/img/logo.svg" alt="" width="38" height="38">
          <span class="brand-name">Quiz<span class="brand-accent">verse</span></span>
        </a>
        <button class="navbar-toggler" type="button" id="nav-toggler" aria-controls="site-nav-links" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="site-nav-links">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            ${links
              .map(([href, label]) => {
                const active = href === currentPage;
                return `<li class="nav-item"><a class="nav-link${active ? " active" : ""}"${active ? ' aria-current="page"' : ""} href="${href}">${label}</a></li>`;
              })
              .join("")}
          </ul>
          <div class="nav-right">
            <button type="button" class="theme-btn" id="theme-toggle" aria-label="Toggle dark mode"><i class="fas fa-moon"></i></button>
            <div id="nav-auth"></div>
          </div>
        </div>
      </div>
    </nav>`;

  // ----- login state -----
  const auth = header.querySelector("#nav-auth");
  const name = Store.getLoggedInUser();
  if (name) {
    const hasAccount = Boolean(Store.getCurrentUser());
    auth.innerHTML = `
      <a class="nav-user" href="${hasAccount ? "edit-profile.html" : "scorecard.html"}" title="${hasAccount ? "Edit profile" : "Scorecard"}">
        <img class="nav-avatar" alt="" src="">
        <span class="nav-user-name"></span>
      </a>
      <button type="button" class="btn btn-outline-light btn-sm" id="logout-btn">Logout</button>`;
    auth.querySelector(".nav-avatar").src = Store.getProfileImage() || Store.DEFAULT_AVATAR;
    auth.querySelector(".nav-user-name").textContent = name; // textContent: names can't inject HTML
    auth.querySelector("#logout-btn").addEventListener("click", () => {
      Store.logout();
      window.location.href = "index.html";
    });
  } else {
    auth.innerHTML = `
      <a class="btn btn-outline-light btn-sm" href="login.html">Login</a>
      <a class="btn btn-accent btn-sm" href="signup.html">Sign Up</a>`;
  }

  // ----- mobile menu (no Bootstrap JS needed) -----
  const toggler = header.querySelector("#nav-toggler");
  const menu = header.querySelector("#site-nav-links");
  toggler.addEventListener("click", () => {
    const open = menu.classList.toggle("show");
    toggler.setAttribute("aria-expanded", open);
  });
})();
