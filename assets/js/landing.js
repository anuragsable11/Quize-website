// Landing page: point the secondary call-to-action at the right place.
const secondaryAction = document.getElementById("hero-secondary");

if (Store.getLoggedInUser()) {
  secondaryAction.href = "scorecard.html";
  secondaryAction.textContent = "📊 View my scorecard";
}
