document.addEventListener("DOMContentLoaded", function () {
  // Check if elements exist before adding event listeners
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const drawerClose = document.getElementById("drawer-close");
  
  console.log(from)
  if (hamburger && drawer && drawerClose) {
    hamburger.addEventListener("click", () => {
      drawer.classList.add("open");
    });

    drawerClose.addEventListener("click", () => {
      drawer.classList.remove("open");
    });
  } else {
    console.error("Hamburger menu or drawer elements are missing");
  }

  // Add event listeners to seat layout view buttons
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
  console.log(from)

  // Dropdown focus for 'from' and 'to'
  const dropdownBtnFrom = document.getElementById("dropdown-btn");
  const dropdownBtnTo = document.getElementById("dropdown-btn-to");

  if (dropdownBtnFrom) {
    dropdownBtnFrom.addEventListener("click", function () {
      document.getElementById("from").focus();
    });
  }

  if (dropdownBtnTo) {
    dropdownBtnTo.addEventListener("click", function () {
      document.getElementById("to").focus();
    });
  }

  // Seat selection functionality
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
  
  // Get all selected seats in the current layout
  const selectedSeats = Array.from(
    seatLayout.querySelectorAll(".seat.selected")
  ).map((seat) => seat.id); // Create an array of selected seat IDs

  // Update the displayed selected seats
  const selectedSeatsElement = document.getElementById(`selected-seats-${layoutId}`);
  if (selectedSeatsElement) {
    selectedSeatsElement.textContent = selectedSeats.join(", ");
  }

  // Update the total fare based on the number of selected seats
  const farePerSeat = 1800; // Assuming the fare is NPR 1800 per seat
  const totalFare = selectedSeats.length * farePerSeat;
  const fareElement = document.getElementById(`fare-${layoutId}`);
  const totalAmountElement = document.getElementById(`total-amount-${layoutId}`);

  if (fareElement) {
    fareElement.textContent = farePerSeat;
  }
  if (totalAmountElement) {
    totalAmountElement.textContent = totalFare;
  }
}
