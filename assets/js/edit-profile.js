const previewImage = document.getElementById("previewImage");
const usernameInput = document.getElementById("newUsername");
const picInput = document.getElementById("newPic");
const deleteBtn = document.getElementById("deletePic");
const form = document.getElementById("editProfileForm");
const message = document.getElementById("message");

const showMessage = (text, type = "danger") => {
  message.textContent = text;
  message.className = `alert alert-${type} mt-3 mb-0`;
};

// Shrink the photo to a small square before storing it: localStorage only
// holds about 5 MB in total, and a phone photo alone can be larger than that.
const resizeImage = (file, size = 200) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height); // crop to a centred square
      canvas
        .getContext("2d")
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = url;
  });

const persistUser = (user) => {
  const users = Store.getUsers();
  const index = users.findIndex((u) => u.email === user.email);
  if (index === -1) {
    users.push(user);
  } else {
    users[index] = user;
  }
  Store.saveUsers(users);
  Store.setSession(user); // refresh the name and photo shown on other pages
};

const user = Store.getCurrentUser();

if (!user) {
  // Guests have no profile to edit
  window.location.replace("login.html");
} else {
  previewImage.src = user.profileImage || Store.DEFAULT_AVATAR;
  usernameInput.value = user.name;

  // Preview the chosen photo straight away
  picInput.addEventListener("change", async () => {
    const file = picInput.files[0];
    if (!file) return;
    try {
      previewImage.src = await resizeImage(file);
    } catch (err) {
      picInput.value = "";
      showMessage(err.message);
    }
  });

  deleteBtn.addEventListener("click", () => {
    delete user.profileImage;
    picInput.value = "";
    previewImage.src = Store.DEFAULT_AVATAR;
    persistUser(user);
    showMessage("Photo removed.", "success");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = usernameInput.value.trim();
    if (!newName) {
      showMessage("Please enter a username.");
      return;
    }

    try {
      const file = picInput.files[0];
      if (file) user.profileImage = await resizeImage(file);
    } catch (err) {
      showMessage(err.message);
      return;
    }

    const oldName = user.name;
    user.name = newName;
    persistUser(user);

    // Scores saved by older versions are keyed by name only, so carry them
    // over to the new name; newer entries are matched by email anyway.
    if (oldName !== newName) {
      Store.saveScores(
        Store.getScores().map((s) =>
          s.name === oldName && (!s.email || s.email === user.email) ? { ...s, name: newName } : s
        )
      );
    }

    window.location.href = "scorecard.html";
  });
}
