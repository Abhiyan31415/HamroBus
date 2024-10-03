const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawer-close");

hamburger.addEventListener("click", () => {
  drawer.classList.add("open");
});

drawerClose.addEventListener("click", () => {
  drawer.classList.remove("open");
});

document.querySelectorAll(".view-seats-btn").forEach((button) => {
  button.addEventListener("click", function () {
    alert("View seats functionality to be implemented.");
  });
});
document.getElementById("dropdown-btn").addEventListener("click", function () {
  document.getElementById("from").focus();
});

document
  .getElementById("dropdown-btn-to")
  .addEventListener("click", function () {
    document.getElementById("to").focus();
  });
