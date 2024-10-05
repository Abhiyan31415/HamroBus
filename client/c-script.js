document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const drawerClose = document.getElementById("drawer-close");

  // Check if hamburger menu and drawer elements exist
  if (hamburger && drawer && drawerClose) {
    hamburger.addEventListener("click", () => {
      drawer.classList.add("open");
    });

    drawerClose.addEventListener("click", () => {
      drawer.classList.remove("open");
    });
  } else {
    console.error("Hamburger menu or drawer elements are missing.");
  }

  const viewAllButton = document.querySelector(".view-all-btn");
  const cards = document.querySelectorAll(".card");

  // Check if cards and viewAllButton exist
  if (viewAllButton && cards.length > 0) {
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
  } else {
    console.error("View All button or cards are missing.");
  }

  const fromInput = document.getElementById("dropdown-btn");
  const toInput = document.getElementById("dropdown-btn-to");

  // Check if from and to input elements exist before adding event listeners
  if (fromInput) {
    document.getElementById("dropdown-btn").addEventListener("click", function () {
      fromInput.focus();
    });
  } else {
    console.error("'From' input element is missing.");
  }

  if (toInput) {
    document.getElementById("dropdown-btn-to").addEventListener("click", function () {
      toInput.focus();
    });
  } else {
    console.error("'To' input element is missing.");
  }

  const form = document.getElementById("search-form");

  // Ensure form exists before adding a submit event listener
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Access the input values
      const fromCity = document.getElementById("dropdown-btn").value;
      const toCity = document.getElementById("dropdown-btn-to").value;
      const selectedDate = formatDate(document.getElementById("date").value);


      // Log values to the console (for debugging)
      console.log("From:", fromCity);
      console.log("To:", toCity);
      console.log("Date:", selectedDate);

      // Optionally save the values in localStorage
      localStorage.setItem("from", fromCity);
      localStorage.setItem("to", toCity);
      localStorage.setItem("date", selectedDate);

      // Redirect to the Search.html page
      window.location.href = "Search.html";
    });
  } else {
    console.error("Search form is missing.");
  }
});
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
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