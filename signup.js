document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
  
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Load existing users or initialize array
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if email already exists
    const exists = users.some(user => user.email === email);
    if (exists) {
      alert("Email already registered. Please login.");
      return;
    }
  
    // Add new user
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  });
  
  