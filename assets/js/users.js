const users = Store.getUsers();
const userList = document.getElementById("userList");

if (users.length === 0) {
  userList.innerHTML = "<p>No registered users found.</p>";
} else {
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-box";
    div.innerHTML = `<strong>Name:</strong> <span class="name"></span><br><strong>Email:</strong> <span class="email"></span>`;
    // textContent, so names can't inject HTML into the page
    div.querySelector(".name").textContent = user.name;
    div.querySelector(".email").textContent = user.email;
    userList.appendChild(div);
  });
}
