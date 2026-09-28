const displayName = Store.getLoggedInUser() || "Guest";
const currentUser = Store.getCurrentUser();

document.getElementById("userName").textContent = displayName;

// ---------- Sidebar: profile image with dropdown menu ----------

const profileImage = document.getElementById("profileImage");
const profileMenu = document.getElementById("profileMenu");
const profileMenuLink = document.getElementById("profileMenuLink");

profileImage.src = Store.getProfileImage() || Store.DEFAULT_AVATAR;

if (!currentUser) {
  // Guests have no account to edit
  profileMenuLink.href = "login.html";
  profileMenuLink.textContent = "🔑 Log in";
}

profileImage.addEventListener("click", () => {
  profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
});

// Hide menu when clicking outside
document.addEventListener("click", (e) => {
  if (!profileImage.contains(e.target) && !profileMenu.contains(e.target)) {
    profileMenu.style.display = "none";
  }
});

document.getElementById("logoutLink").addEventListener("click", () => Store.logout());

// ---------- Score history and improvement chart ----------

// Older entries only have the "3/5" string; newer ones also store the numbers.
const scores = Store.getMyScores().map((s) => {
  const [c, t] = s.score.split("/").map(Number);
  const correct = s.correct ?? c;
  const total = s.total ?? t;
  return { ...s, correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
});

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const scoreListDiv = document.getElementById("scoreList");
const statsDiv = document.getElementById("stats");

if (scores.length === 0) {
  const p = el("p", null, "No scores yet. ");
  const link = el("a", null, "Play a quiz!");
  link.href = "index.html";
  p.appendChild(link);
  scoreListDiv.appendChild(p);
} else {
  scores.forEach((s, i) => {
    const box = el("div", "score-box");
    const main = el("span", null, `Attempt #${i + 1}: `);
    main.appendChild(el("strong", null, s.score));
    main.append(` (${s.percent}%)`);
    box.appendChild(main);

    const details = [
      s.category,
      s.difficulty && s.difficulty !== "any" ? capitalize(s.difficulty) : null,
      s.date ? new Date(s.date).toLocaleDateString() : null,
    ]
      .filter(Boolean)
      .join(" · ");
    if (details) box.appendChild(el("small", "text-muted", details));

    scoreListDiv.appendChild(box);
  });

  const percents = scores.map((s) => s.percent);
  const best = Math.max(...percents);
  const average = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
  statsDiv.textContent = `${scores.length} attempt${scores.length === 1 ? "" : "s"} · Best: ${best}% · Average: ${average}%`;

  // Percentages make attempts with different question counts comparable.
  new Chart(document.getElementById("scoreChart").getContext("2d"), {
    type: "line",
    data: {
      labels: scores.map((_, i) => `Attempt ${i + 1}`),
      datasets: [
        {
          label: "Score (%)",
          data: percents,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      maintainAspectRatio: false, // fill .chart-wrap
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (value) => `${value}%` },
        },
      },
    },
  });
}
