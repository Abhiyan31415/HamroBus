const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawer-close");

hamburger.addEventListener("click", () => {
  drawer.classList.add("open");
});

drawerClose.addEventListener("click", () => {
  drawer.classList.remove("open");
});
