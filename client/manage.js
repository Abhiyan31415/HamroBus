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
document.addEventListener("DOMContentLoaded", async () => {
  await fetchTickets(); // Call fetchTickets when the DOM is fully loaded
});
async function fetchTickets() {
    const response = await fetch("/api/tickets/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: localStorage.getItem("username"),
            contact: localStorage.getItem("contact"),
        }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error fetching tickets:", errorResponse.message);
        return;
    }

    const tickets = await response.json();
    console.log("Fetched tickets:", tickets);
    displayTickets(tickets);
   
}



function displayTickets(ticketData) {
  const busListingContainer = document.querySelector('.bus-listing');
  busListingContainer.innerHTML = ''; // Clear existing tickets

  // Create an array of ticket objects from the properties
  const tickets = ticketData.arrivalTime.map((_, index) => ({
      busName: ticketData.busName[index],
      departureTime: ticketData.departureTime[index],
      arrivalTime: ticketData.arrivalTime[index],
      fromLocation: ticketData.fromLocation[index],
      routeNumber: ticketData.routeNumber[index],
      toLocation: ticketData.toLocation[index],
      travelDate: ticketData.travelDate[index],
      bookedSeats: ticketData.bookedSeats[index]
  }));

  // Now iterate over the tickets array and display them
  tickets.forEach((ticket) => {
      const busItem = document.createElement('div');
      busItem.classList.add('para');

      busItem.innerHTML = `
          <div class="bus-item">
              <div class="bus-info">
                  <h4>${ticket.busName}</h4>
                  <div class="time-info">
                      <div class="left-time">
                          <span class="time">${new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span class="location"><strong>${ticket.fromLocation}</strong></span>
                      </div>
                      <div class="duration-container">
                          <span class="line"></span>
                          <span class="duration">16:00 hrs</span>
                          <span class="line"></span>
                      </div>
                      <div class="right-time">
                          <span class="time">${new Date(ticket.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span class="location"><strong>${ticket.toLocation}</strong></span>
                      </div>
                  </div>
              </div>
              <div class="bus-actions">
                  <span style="font-size: large;text-align: center;color:#283f5e;">Ticket Number: ${ticket.routeNumber}</span>
                  <span> Seat Number: ${ticket.bookedSeats.join(', ')}</span>
                  <div class="price">
                      <span>Departure: ${ticket.travelDate}</span>
                  </div>
              </div>
          </div>
          <p class="amenities">
              <a href="#amenities">Amenities</a> |
              <a href="#cancellation">Cancellation Terms</a> |
              <a href="#reviews">Reviews</a> |
              <a href="#boarding">Boarding & Dropping</a>
          </p>
      `;
      busListingContainer.appendChild(busItem); // Append the new bus item
  });
}

