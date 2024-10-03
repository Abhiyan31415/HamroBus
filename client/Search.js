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
  const selectedSeats = Array.from(
    seatLayout.querySelectorAll(".seat.selected")
  ).map((seat) => seat.id);

  seatLayout.querySelector(`#selected-seats-${layoutId}`).textContent =
    selectedSeats.join(", ");

  let farePerSeat = 1800;
  let totalFare = farePerSeat * selectedSeats.length;
  seatLayout.querySelector(`#fare-${layoutId}`).textContent = totalFare;
  seatLayout.querySelector(`#total-amount-${layoutId}`).textContent = totalFare;
  var from = document.getElementById("location").innerText;
  var to = document.getElementById("destination").innerText;
  var date = document.getElementById("time").innerText;
  readData(totalFare, selectedSeats.length,from,to,date);
}

function readData(totalFare, seat,from,to,date) { 
  //var seat = document.getElementById("seat").value;
  var fare = 1800;  // Adjusted fare per seat
  var totalAmount = totalFare;  // Assuming seat holds the number of seats

  var data = {
    from: from,
    to: to,
    date: date,
    seat: seat,
    fare: fare,
    totalAmount: totalAmount
  };

  console.log(data);
  fetch("https://example.com/api/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
