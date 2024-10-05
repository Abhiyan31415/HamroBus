document.addEventListener("DOMContentLoaded", () => {
    initHamburgerMenu();
    initSeatSelection();
    initDropdownFocus();
    initFormSubmission();

    // Automatically trigger search on page load if data exists in localStorage
    const fromCity = localStorage.getItem("from");
    const toCity = localStorage.getItem("to");
    const date = localStorage.getItem("date");

    if (fromCity && toCity && date) {
        fetchBusListings(fromCity, toCity, date);
    }
});

// Initialize the hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.getElementById("hamburger");
    const drawer = document.getElementById("drawer");
    const drawerClose = document.getElementById("drawer-close");

    if (hamburger && drawer && drawerClose) {
        hamburger.addEventListener("click", () => toggleDrawer(drawer, true));
        drawerClose.addEventListener("click", () =>
            toggleDrawer(drawer, false)
        );
    } else {
        console.error("Hamburger menu or drawer elements are missing");
    }
}

function toggleDrawer(drawer, isOpen) {
    drawer.classList.toggle("open", isOpen);
}

// Initialize the seat selection functionality
// Initialize the seat selection functionality
function initSeatSelection() {
    document.querySelectorAll(".view-seats-btn").forEach((button) => {
        const routeNumber = button.dataset.busId;
        button.addEventListener("click", () => toggleSeatLayout(routeNumber));
    });

    document.querySelectorAll(".seat").forEach((seat) => {
        seat.addEventListener("click", () => {
            if (seat.classList.contains("available")) {
                // Change class to booked
                seat.classList.remove("available");
                seat.classList.add("selected");
            } else if (seat.classList.contains("selected")) {
                // Optionally, allow unbooking (toggle back to available)
                seat.classList.remove("selected");
                seat.classList.add("available");
            }

            const layoutId = seat.closest(".seat-layout").id.split("-").pop();
            updateSelectedSeats(layoutId); // Update the fare and selected seats display
        });
    });
}
function layid(routeNumber) {
    // Select the seat layout for the specific bus route
    const seatLayout = document.getElementById(`seat-layout-${routeNumber}`);

    if (seatLayout) {
        // Find all selected seats within the layout and map their IDs
        const selectedSeats = Array.from(
            seatLayout.querySelectorAll(".seat.selected")
        ).map((seat) => seat.id);

        return selectedSeats;
    } else {
        console.error(`Seat layout for route number ${routeNumber} not found.`);
        return [];
    }
}

function toggleSeatLayout(routeNumber) {
    const seatLayout = document.getElementById(`seat-layout-${routeNumber}`);
    if (seatLayout) {
        seatLayout.style.display =
            seatLayout.style.display === "block" ? "none" : "block";
    } else {
        console.log(`Seat layout for bus ${routeNumber} not found`);
    }
}

// Update selected seats and fare using routeNumber
function updateSelectedSeats(layoutId) {
    // This function can be implemented to update selected seats and fare details
    let farePerSeat = 0;
    const seatLayout = document.getElementById(`seat-layout-${layoutId}`);
    farePerSeat = parseFloat(seatLayout.dataset.fare); // Get fare from data attribute
    console.log("farePerSeat:", farePerSeat);

    const selectedSeats = Array.from(
        document.querySelectorAll(`#seat-layout-${layoutId} .seat.selected`)
    )
        .map((seat) => seat.id)
        .join(", "); // Get IDs of selected seats

    // Update the corresponding selected seats display
    updateTextContent(`selected-seats-${layoutId}`, selectedSeats);
    if (selectedSeats.length === 0) {
        farePerSeat = 0;
    }

    // Calculate and update fare (assuming a fare of NPR 100 per seat for this example)
    const fare = selectedSeats.split(", ").length * farePerSeat; // Example fare calculation
    updateTextContent(`fare-${layoutId}`, fare);

    // Update total amount (assuming some fixed charge; for example: 10% service charge)
    const serviceCharge = 0.1 * fare;
    const totalAmount = fare + serviceCharge; // Total amount including service charge
    updateTextContent(`total-amount-${layoutId}`, totalAmount.toFixed(2));
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
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const { fromCity, toCity, date } = getFormValues();
            // Save data to local storage
            localStorage.setItem("from", fromCity);
            localStorage.setItem("to", toCity);
            localStorage.setItem("date", date);
            console.log("Stored in local storage:", { fromCity, toCity, date });

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

    console.log("Formatted Date:", date); // Add this to log the formatted date

    return { fromCity, toCity, date };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    // Return the date in MM-DD-YYYY format
    return `${month}-${day}-${year}`;
}

// Fetch bus listings from API
async function fetchBusListings(from, to, date) {
    console.log("Sending request with payload:", { from, to, date });

    try {
        const response = await fetch("http://localhost:5000/api/buses/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, date }), // Make sure the format is correct
        });

        console.log("Server response:", response);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
            );
        }

        const busListings = await response.json();
        displayBusListings(busListings);
    } catch (error) {
        console.error("Error fetching buses:", error);
    }
}

// Display bus listings
function displayBusListings(busListings) {
    const busListContainer = document.querySelector(".bus-listing");

    // Clear previous results
    busListContainer.innerHTML = "";
    console.log("Displaying bus listings:", busListings);
    busListings.forEach((bus) => {
        let busItem = `
      <div class="bus-item">
          <div class="total">
              <div class="bus-info">
                  <h4>${bus.routeNumber} - ${bus.busName} Adventure</h4>
                  <div class="time-info">
                      <div class="left-time">
                          <span class="time">${new Date(
                              bus.departureTime
                          ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                          })}</span>
                          <span class="location"><strong>${
                              bus.fromLocation
                          }</strong></span>
                      </div>
                      <div class="duration-container">
                          <span class="line"></span>
                          <span class="duration">~${calculateDuration(
                              bus.departureTime,
                              bus.arrivalTime
                          )} hrs</span>
                          <span class="line"></span>
                      </div>
                      <div class="right-time">
                          <span class="time">${new Date(
                              bus.arrivalTime
                          ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                          })}</span>
                          <span class="location"><strong>${
                              bus.toLocation
                          }</strong></span>
                      </div>
                  </div>
              </div>
              <div class="bus-actions">
                  <span>Available Seats: ${bus.availableSeats}</span>
                  <div class="price">
                      <span>NPR ${bus.price}</span>
                  </div>
                  <button class="view-seats-btn" data-bus-id="${
                      bus.routeNumber
                  }">View Seats</button>
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
          <div id="seat-layout-${
              bus.routeNumber
          }" class="seat-layout" data-fare="${bus.price}"style="display: none;">
              <div class="seat-map">`;

        const bookedSeats = bus.seats;
        for (let i = 1; i <= bus.availableSeats / 2; i++) {
            ["A", "B"].forEach((row) => {
                let seatId = `${row}${i}`;
                let seatClass = bookedSeats.includes(seatId)
                    ? "booked"
                    : "available";
                busItem += `<div class="seat ${seatClass}" id="${seatId}">${seatId}</div>`;
            });
        }
        if (bus.availableSeats % 2 == 1) {
            let seatId1 = `A${bus.availableSeats / 2 + 0.5}`;
            let seatClass1 = bookedSeats.includes(seatId1)
                ? "booked"
                : "available";
            busItem += `<div class="seat ${seatClass1}" id="${seatId1}">${seatId1}</div>`;
        }

        busItem += `</div>
              <div class="fare-info">
                  <div>Selected Seats: <span id="selected-seats-${bus.routeNumber}"></span></div>
                  <div>Fare: <span id="fare-${bus.routeNumber}"></span></div>
                  <div>Total Amount: <span id="total-amount-${bus.routeNumber}"></span></div>
                  <button class="book-btn" data-bus-id="${bus.routeNumber}">Book Now</button>
              </div>
          </div>
      </div>`;
        busListContainer.innerHTML += busItem;
    });

    // Call initSeatSelection here to bind the event listeners after bus items are added
    initSeatSelection();

    document.querySelectorAll(".book-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const routeNumber = button.dataset.busId;
            console.log("layoutId:", layid(routeNumber));
            handleBooking(routeNumber, layid(routeNumber));
        });
    });
}

function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / (1000 * 60 * 60); // Duration in hours
    return duration.toFixed(2); // Return as fixed two decimal places
}
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

async function handleBooking(routeNumber, selectedSeatIds) {
    const seatLayout = document.getElementById(`seat-layout-${routeNumber}`);

    if (!seatLayout) {
        console.error(`Seat layout for route ${routeNumber} not found.`);
        return;
    }

    // Check if selectedSeatIds is not empty
    if (selectedSeatIds.length > 0) {
        // Loop through the selected seats and mark them as booked
        selectedSeatIds.forEach((seatId) => {
            const seat = seatLayout.querySelector(`#${seatId}`);
            if (seat && seat.classList.contains("selected")) {
                seat.classList.remove("selected");
                seat.classList.add("booked"); // Mark as booked
            } else {
                console.error(
                    `Seat ${seatId} not found or is not in a selected state.`
                );
            }
        });
        console.log("Selected seats:", selectedSeatIds);

        // Send selected seats to backend
        try {
            const response = await fetch("/api/buses/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    routeNumber: routeNumber,
                    cseats: selectedSeatIds,
                    username: localStorage.getItem("username"),
                    contact: localStorage.getItem("contact"),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error booking seats: ${errorText}`);
            }

            const result = await response.json();
            console.log("Booking successful:", result);
            updateTextContent(`fare-${routeNumber}`, ""); // Clear fare
            updateTextContent(`total-amount-${routeNumber}`, "");
            updateTextContent(`selected-seats-${routeNumber}`, "");
            // Clear total amount
            alert("Tickets booked successfully!");
            // Optionally, display a success message or update UI
        } catch (error) {
            console.error("Error during booking:", error);
            // Optionally, display an error message to the user
        }
    } else {
        alert("Please select at least one seat to book.");
    }
}
