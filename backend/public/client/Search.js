document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initSeatSelection();
  initDropdownFocus();
  initFormSubmission();

const fromCity = localStorage.getItem("from") || "";
const toCity = localStorage.getItem("to") || "";
const date = localStorage.getItem("date") || "";

document.getElementById("from").value = fromCity;
document.getElementById("to").value = toCity;
document.getElementById("date").value = date;

if (fromCity && toCity && date) {
  fetchBusListings(fromCity, toCity, formatDate(date));
}
});
// Initialize the hamburger menu functionality
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const drawerClose = document.getElementById("drawer-close");

  if (hamburger && drawer && drawerClose) {
    hamburger.addEventListener("click", () => toggleDrawer(drawer, true));
    drawerClose.addEventListener("click", () => toggleDrawer(drawer, false));
  } else {
    console.error("Hamburger menu or drawer elements are missing");
  }
}

function toggleDrawer(drawer, isOpen) {
  drawer.classList.toggle("open", isOpen);
}

// Initialize the seat selection functionality
function initSeatSelection() {
  document.querySelectorAll(".view-seats-btn").forEach((button) => {
    const routeNumber = button.dataset.busId;
    button.addEventListener("click", () => toggleSeatLayout(routeNumber));
  });

  document.querySelectorAll(".seat").forEach((seat) => {
    seat.addEventListener("click", () => {
      if (!seat.classList.contains("booked")) {
        seat.classList.toggle("selected");
        const layoutId = seat.closest(".seat-layout").id.split("-").pop();
        updateSelectedSeats(layoutId);
      }
    });
  });
}

function toggleSeatLayout(routeNumber) {
  const seatLayout = document.getElementById(`seat-layout-${routeNumber}`);
  if (seatLayout) {
    seatLayout.style.display = seatLayout.style.display === "block" ? "none" : "block";
  } else {
    console.log(`Seat layout for bus ${routeNumber} not found`);
  }
}

// Update selected seats and fare using routeNumber
function updateSelectedSeats(routeNumber) {
  const seatLayout = document.getElementById(`seat-layout-${routeNumber}`);
  const selectedSeats = Array.from(seatLayout.querySelectorAll(".seat.selected")).map(seat => seat.id);

  // Assuming a constant price of NPR 1800 per seat
  const fare = 1800;

  // Update selected seats and total fare
  updateTextContent(`selected-seats-${routeNumber}`, selectedSeats.join(", "));
  updateTextContent(`fare-${routeNumber}`, fare); 
  updateTextContent(`total-amount-${routeNumber}`, selectedSeats.length * fare);
}

// Helper function to update text content
function updateTextContent(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content;
  }
}

// Initialize dropdown focus functionality
function initDropdownFocus() {
  const dropdownBtnFrom = document.getElementById("dropdown-btn");
  const dropdownBtnTo = document.getElementById("dropdown-btn-to");

  addDropdownFocusListener(dropdownBtnFrom, "from");
  addDropdownFocusListener(dropdownBtnTo, "to");
}

function addDropdownFocusListener(dropdownBtn, targetId) {
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", () => {
      document.getElementById(targetId).focus();
    });
  }
}

// Initialize form submission
function initFormSubmission() {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async function(event) {
      event.preventDefault();
      const { fromCity, toCity, date } = getFormValues();
      await fetchBusListings(fromCity, toCity, date);
    });
  } else {
    console.error("Form element not found");
  }
}

function getFormValues() {
  const fromCity = document.getElementById("from").value;
  const toCity = document.getElementById("to").value;
  const date = formatDate(document.getElementById("date").value); 

  return { fromCity, toCity, date };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`; // Return in MM-DD-YYYY format
}

// Fetch bus listings from API
async function fetchBusListings(from, to, date) {
  const busListContainer = document.querySelector('.bus-listing');
  busListContainer.innerHTML = '<div class="loading">Loading...</div>';

  try {
    const response = await fetch('http://localhost:5000/api/buses/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, date })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const busListings = await response.json();
    displayBusListings(busListings.length ? busListings : getMockBusListings(from, to, date));
  } catch (error) {
    console.error('Error fetching buses:', error);
    busListContainer.innerHTML = '<p>Error loading bus listings. Please try again.</p>';
  }
}

// Display bus listings
function displayBusListings(busListings) {
  const busListContainer = document.querySelector('.bus-listing');
  
  // Clear previous results
  busListContainer.innerHTML = '';

  busListings.forEach((bus) => {
    const busItem = `
    <div class="bus-item">
      <div class="total">
        <div class="bus-info">
          <h4>${bus.routeNumber} - ${bus.routeNumber} Adventure</h4>
          <div class="time-info">
            <div class="left-time">
              <span class="time">${new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span class="location"><strong>${bus.fromLocation}</strong></span>
            </div>
            <div class="duration-container">
              <span class="line"></span>
              <span class="duration">~${calculateDuration(bus.departureTime, bus.arrivalTime)} hrs</span>
              <span class="line"></span>
            </div>
            <div class="right-time">
              <span class="time">${new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span class="location"><strong>${bus.toLocation}</strong></span>
            </div>
          </div>
        </div>
        <div class="bus-actions">
          <span>Available Seats: ${bus.availableSeats}</span>
          <div class="price">
            <span>NPR ${bus.price}</span>
          </div>
          <button class="view-seats-btn" data-bus-id="${bus.routeNumber}">View Seats</button>
        </div>
      </div>
      <div>
        <p class="amenities">
          <a href="#amenities">Amenities</a> |
          <a href="#cancellation">Cancellation Terms</a> |
          <a href="#reviews">Reviews</a> |
          <a href="#boarding">Boarding & Dropping</a>
        </p>
      </div>
      <div id="seat-layout-${bus.routeNumber}" class="seat-layout" style="display: none;">
        <div class="seat-map">
          <div class="seat available" id="A1">A1</div>
          <div class="seat available" id="A2">A2</div>
          <div class="seat booked" id="A17">A17</div>
          <div class="seat selected" id="A18">A18</div>
           <div class="seat available" id="B1">B1</div>
          <div class="seat available" id="B2">B2</div>
          <div class="seat booked" id="B17">B17</div>
          <div class="seat selected" id="B18">B18</div>
           <div class="seat booked" id="C1">C1</div>
          <div class="seat available" id="C2">C2</div>
          <div class="seat booked" id="C17">C17</div>
          <div class="seat selected" id="C18">C18</div>
           <div class="seat booked" id="D1">D1</div>
          <div class="seat booked" id="D2">D2</div>
          <div class="seat booked" id="D17">D17</div>
          <div class="seat selected" id="D18">D18</div>
        </div>
        <div class="seat-info">
          <label for="boarding-point-${bus.routeNumber}">Boarding Point</label>
          <select id="boarding-point-${bus.routeNumber}">
            <option value="point1">Select Boarding Points</option>
            <option value="point2">Point 2</option>
          </select>
          <p>Seat(s): <span id="selected-seats-${bus.routeNumber}"></span></p>
          <p>Fare: Rs. <span id="fare-${bus.routeNumber}">0</span></p>
          <p>Total Amount: Rs. <span id="total-amount-${bus.routeNumber}">0</span></p>
          <button id="continue-${bus.routeNumber}">Continue</button>
        </div>
      </div>
    </div>
  `;
    busListContainer.innerHTML += busItem;
  });

  // Reinitialize seat selection functionality for newly added elements
  initSeatSelection();
}

// Function to calculate bus duration
function calculateDuration(departure, arrival) {
  const depTime = new Date(departure);
  const arrTime = new Date(arrival);
  const diff = (arrTime - depTime) / (1000 * 60 * 60); // Convert ms to hours
  return diff.toFixed(2); // Round to 2 decimal places
}

// Fallback for mock bus listings if needed
