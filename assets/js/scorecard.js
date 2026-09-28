const displayName = Store.getLoggedInUser() || "Guest";
const currentUser = Store.getCurrentUser();

// ---------- Profile card ----------

document.getElementById("userName").textContent = displayName;
document.getElementById("profileImage").src = Store.getProfileImage() || Store.DEFAULT_AVATAR;

const userMeta = document.getElementById("userMeta");
const profileAction = document.getElementById("profileAction");

if (currentUser) {
  userMeta.textContent = currentUser.email;
} else {
  // Guests have no account to edit
  userMeta.textContent = "Playing as a guest. Log in to save scores to your account.";
  profileAction.href = "login.html";
  profileAction.textContent = "🔑 Log in";
}

// ---------- Score history ----------

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
const chartCard = document.getElementById("chartCard");
const statAttempts = document.getElementById("stat-attempts");
const statBest = document.getElementById("stat-best");
const statAverage = document.getElementById("stat-average");

if (scores.length === 0) {
  const p = el("p", "mb-0", "No scores yet. ");
  const link = el("a", null, "Play a quiz!");
  link.href = "quiz.html";
  p.appendChild(link);
  scoreListDiv.appendChild(p);
  statAttempts.textContent = "0";
  statBest.textContent = "–";
  statAverage.textContent = "–";
  chartCard.classList.add("hide");
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
  statAttempts.textContent = scores.length;
  statBest.textContent = `${Math.max(...percents)}%`;
  statAverage.textContent = `${Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)}%`;

  // ---------- Improvement chart ----------

  // Grid and label colours that read well on the current theme
  const chartColors = () => {
    const dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    return {
      text: dark ? "#c7c9d6" : "#4b5563",
      grid: dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    };
  };

  const colors = chartColors();
  // Percentages make attempts with different question counts comparable.
  const chart = new Chart(document.getElementById("scoreChart").getContext("2d"), {
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
      plugins: { legend: { labels: { color: colors.text } } },
      scales: {
        x: { ticks: { color: colors.text }, grid: { color: colors.grid } },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: colors.text, callback: (value) => `${value}%` },
          grid: { color: colors.grid },
        },
      },
    },
  });

  document.addEventListener("themechange", () => {
    const c = chartColors();
    chart.options.plugins.legend.labels.color = c.text;
    ["x", "y"].forEach((axis) => {
      chart.options.scales[axis].ticks.color = c.text;
      chart.options.scales[axis].grid.color = c.grid;
    });
    chart.update();
  });
}
