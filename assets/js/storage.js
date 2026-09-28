// Shared localStorage access used by every page.
// Key names are kept from earlier versions so previously saved data still loads.
const Store = {
  DEFAULT_AVATAR: "https://i.pravatar.cc/100",

  // ----- accounts -----
  getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  },
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  // ----- session -----
  getLoggedInUser() {
    return localStorage.getItem("loggedInUser");
  },
  getLoggedInEmail() {
    return localStorage.getItem("loggedInEmail");
  },
  getProfileImage() {
    return localStorage.getItem("loggedInProfile");
  },
  // Remember who is logged in (name, email and photo shown on every page).
  setSession(user) {
    localStorage.setItem("loggedInUser", user.name);
    localStorage.setItem("loggedInEmail", user.email);
    if (user.profileImage) {
      localStorage.setItem("loggedInProfile", user.profileImage);
    } else {
      localStorage.removeItem("loggedInProfile");
    }
  },
  logout() {
    ["loggedInUser", "loggedInEmail", "loggedInProfile"].forEach((key) =>
      localStorage.removeItem(key)
    );
  },
  // The account of the logged-in user, or null when playing as a guest.
  // Older sessions only stored the name, so fall back to it.
  getCurrentUser() {
    const email = Store.getLoggedInEmail();
    const name = Store.getLoggedInUser();
    if (!email && !name) return null;
    return (
      Store.getUsers().find((u) => (email ? u.email === email : u.name === name)) ||
      null
    );
  },

  // ----- scores -----
  getScores() {
    return JSON.parse(localStorage.getItem("scoreList")) || [];
  },
  saveScores(scores) {
    localStorage.setItem("scoreList", JSON.stringify(scores));
  },
  addScore(entry) {
    const scores = Store.getScores();
    scores.push(entry);
    Store.saveScores(scores);
  },
  // Scores of the logged-in user, or of guests when nobody is logged in.
  // Entries saved by older versions have no email, so those match by name.
  getMyScores() {
    const email = Store.getLoggedInEmail();
    const name = Store.getLoggedInUser() || "Guest";
    return Store.getScores().filter((s) =>
      s.email && email ? s.email === email : s.name === name
    );
  },

  // ----- theme -----
  getTheme() {
    return localStorage.getItem("theme");
  },
  setTheme(theme) {
    localStorage.setItem("theme", theme);
  },
};
