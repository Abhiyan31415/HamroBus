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
  const viewAllButton = document.querySelector(".view-all-btn");
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    if (index >= 3) {
      card.style.display = "none";
    }
  });

  viewAllButton.addEventListener("click", () => {
    if (viewAllButton.textContent === "View More") {
      cards.forEach((card) => {
        card.style.display = "block";
      });
      viewAllButton.textContent = "View Less";
    } else {
      cards.forEach((card, index) => {
        if (index >= 3) {
          card.style.display = "none";
        }
      });
      viewAllButton.textContent = "View More";
    }
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
