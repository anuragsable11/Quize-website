const message = document.getElementById("message");

const showMessage = (text, type = "danger") => {
  message.textContent = text;
  message.className = `alert alert-${type} mt-3 mb-0`;
};

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  const user = Store.getUsers().find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    showMessage("Invalid email or password.");
    return;
  }

  Store.setSession(user);
  window.location.href = "quiz.html";
});
