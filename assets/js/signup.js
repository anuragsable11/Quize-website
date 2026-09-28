const message = document.getElementById("message");

const showMessage = (text, type = "danger") => {
  message.textContent = text;
  message.className = `alert alert-${type} mt-3 mb-0`;
};

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    showMessage("Please fill in all fields.");
    return;
  }
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  const users = Store.getUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    showMessage("This email is already registered. Please log in.");
    return;
  }

  users.push({ name, email, password });
  Store.saveUsers(users);

  showMessage("Account created! Taking you to the login page…", "success");
  e.target.querySelector("button[type=submit]").disabled = true;
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
});
