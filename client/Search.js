document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const drawerClose = document.getElementById("drawer-close");

  hamburger.addEventListener("click", () => {
    drawer.classList.add("open");
  });

  drawerClose.addEventListener("click", () => {
    drawer.classList.remove("open");
  });

  document.querySelectorAll(".view-seats-btn").forEach((button, index) => {
    button.addEventListener("click", function () {
      const seatLayout = document.getElementById(`seat-layout-${index + 1}`);
      if (seatLayout) {
        seatLayout.style.display =
          seatLayout.style.display === "block" ? "none" : "block";
      } else {
        console.log(`Seat layout for bus ${index + 1} not found`);
      }
    });
  });

  document
    .getElementById("dropdown-btn")
    .addEventListener("click", function () {
      document.getElementById("from").focus();
    });

  document
    .getElementById("dropdown-btn-to")
    .addEventListener("click", function () {
      document.getElementById("to").focus();
    });

  document.querySelectorAll(".seat").forEach((seat) => {
    seat.addEventListener("click", function () {
      if (!seat.classList.contains("booked")) {
        seat.classList.toggle("selected");
        const layoutId = seat.closest(".seat-layout").id.split("-").pop();
        updateSelectedSeats(layoutId);
      }
    });
  });
});

function updateSelectedSeats(layoutId) {
  const seatLayout = document.getElementById(`seat-layout-${layoutId}`);
  const selectedSeats = Array.from(
    seatLayout.querySelectorAll(".seat.selected")
  ).map((seat) => seat.id);

  seatLayout.querySelector(`#selected-seats-${layoutId}`).textContent =
    selectedSeats.join(", ");

  let farePerSeat = 1800;
  let totalFare = farePerSeat * selectedSeats.length;
  seatLayout.querySelector(`#fare-${layoutId}`).textContent = totalFare;
  seatLayout.querySelector(`#total-amount-${layoutId}`).textContent = totalFare;
}
