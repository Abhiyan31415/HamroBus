const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawer-close");

hamburger.addEventListener("click", () => {
  drawer.classList.add("open");
});

drawerClose.addEventListener("click", () => {
  drawer.classList.remove("open");
});
document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in by checking localStorage
  const username = localStorage.getItem("username");

  if (username) {
    // Display the username in the navbar
    const usernameDisplay = document.getElementById("username-display");
    const usernameSpan = document.getElementById("username");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");

    usernameSpan.innerHTML = username; // Set the username
    usernameDisplay.style.display = "block"; // Show the username
    document.getElementById("logout-link").style.display = "inline";
    // Hide the Login and Register buttons
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
  }
});
function logout() {
  // Clear session and redirect to login page
  localStorage.removeItem("username");
  localStorage.removeItem("expiry");
  window.location.href = "../admin/login.html"; // Redirect to login page
}