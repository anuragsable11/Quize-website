document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  const loginButton = document.querySelector('button[type="submit"]');
  loginButton.disabled = true;

  setTimeout(() => {
    if (user) {
      localStorage.setItem("loggedInUser", user.name);
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password!");
      loginButton.disabled = false;
    }
  }, 1000);
});

  