const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawer-close");

// Open drawer when hamburger is clicked
hamburger.addEventListener("click", () => {
    drawer.classList.add("open");
});

// Close drawer when close button is clicked
drawerClose.addEventListener("click", () => {
    drawer.classList.remove("open");
});

// Data for booked seats chart
let bookedSeatsData = [0, 300];
let bookedSeatsChart;

// Get the context for the doughnut charts
const ctxDoughnut1 = document
    .getElementById("myDoughnutChart")
    .getContext("2d");
const ctxDoughnut2 = document
    .getElementById("myDoughnutChart2")
    .getContext("2d");
const ctxDoughnut3 = document
    .getElementById("myDoughnutChart3")
    .getContext("2d");
const ctxDoughnut4 = document
    .getElementById("myDoughnutChart4")
    .getContext("2d");

// Function to create the booked seats chart
function createBookedSeatsChart() {
    // Check if an existing chart exists and destroy it
    if (bookedSeatsChart) {
        bookedSeatsChart.destroy();
    }

    const dataDoughnut1 = {
        labels: ["Booked Seats", "Remaining Seats Available"],
        datasets: [
            {
                label: "Chart 1",
                data: bookedSeatsData,
                backgroundColor: ["#FDCB58", "#ACD676"],
                hoverOffset: 4,
            },
        ],
    };

    // Create the booked seats chart
    bookedSeatsChart = new Chart(ctxDoughnut1, {
        type: "doughnut",
        data: dataDoughnut1,
    });
}

// Other chart data (unchanged)
const dataDoughnut2 = {
    labels: ["Buses In Operation", "Buses Available"],
    datasets: [
        {
            label: "Chart 2",
            data: [200, 150],
            backgroundColor: ["#ACD676", "#283F5E"],
            hoverOffset: 4,
        },
    ],
};

const dataDoughnut3 = {
    labels: ["Cities Reached", "Remaining Targeted Cities"],
    datasets: [
        {
            label: "Chart 3",
            data: [450, 50],
            backgroundColor: ["#283F5E", "#FDCB58"],
            hoverOffset: 4,
        },
    ],
};

// Initialize user count data for the Booked Seats chart
let registeredUsersData = [2400, 2100]; // Default values
const dataDoughnut4 = {
    labels: ["Users Registered", "Remaining Targeted Users"],
    datasets: [
        {
            label: "Chart 4",
            data: registeredUsersData,
            backgroundColor: ["#ACD676", "#FDCB58"],
            hoverOffset: 4,
        },
    ],
};

// Create other charts
new Chart(ctxDoughnut2, { type: "doughnut", data: dataDoughnut2 });
new Chart(ctxDoughnut3, { type: "doughnut", data: dataDoughnut3 });
const userChart = new Chart(ctxDoughnut4, {
    type: "doughnut",
    data: dataDoughnut4,
}); // Save the chart instance

// Function to fetch user count from the API
async function fetchUserCount() {
    try {
        const response = await fetch("/api/users/count"); // Ensure the endpoint matches your server
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Number of Booked Seats:", data.userCount);

        // Update the registered user count and redraw the chart
        const totalRegisteredUsers = data.userCount; // Update with actual count
        const totalTargetedUsers = 15; // Set your total targeted users
        const remainingTargetedUsers =
            totalTargetedUsers - totalRegisteredUsers; // Calculate remaining targeted users

        registeredUsersData = [totalRegisteredUsers, remainingTargetedUsers]; // Update data array
        userChart.data.datasets[0].data = registeredUsersData; // Update data
        userChart.update(); // Redraw the chart

        // Update the displayed count
        const registeredUsersDisplay = document.getElementById(
            "registered-users-display"
        ); // Get the element to display user count
        registeredUsersDisplay.innerText = `${totalRegisteredUsers} Registered Users`; // Update the text with the user count
    } catch (error) {
        console.error("Error fetching user count:", error);
    }
}
// Total available seats
// Set the total available seats here

// Function to fetch total booked seats from the API
// Function to fetch total booked seats from the API
async function fetchTotalBookedSeats() {
    try {
        const response = await fetch("/api/bus/total-booked-seats"); // Ensure the endpoint matches your server
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Total booked seats:", data.totalBookedSeats);
        console.log("Total available seats:", data.totalAvailableSeats);

        // Use the available seats fetched from the API
        const totalAvailableSeats = data.totalAvailableSeats; // Set the available seats dynamically from API response

        // Update the booked seats data and redraw the chart
        const totalBookedSeats = data.totalBookedSeats; // Get the total booked seats
        const remainingSeats = totalAvailableSeats - totalBookedSeats; // Calculate remaining seats

        bookedSeatsData[0] = totalBookedSeats; // Update the booked seats data
        bookedSeatsData[1] = remainingSeats; // Update remaining seats data

        const bookedSeatsDisplay = document.getElementById("seats-display"); // Get the element to display booked seats
        bookedSeatsDisplay.innerText = `${totalBookedSeats} Booked Seats`; // Correctly display booked seats

        // Update the booked seats chart with new data
        bookedSeatsChart.data.datasets[0].data = bookedSeatsData; // Update chart data
        bookedSeatsChart.update(); // Redraw the booked seats chart
    } catch (error) {
        console.error("Error fetching total booked seats:", error);
    }
}

// Call the necessary functions when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    createBookedSeatsChart(); // Create the booked seats chart
    fetchUserCount(); // Fetch user count when the dashboard loads
    fetchTotalBookedSeats(); // Fetch total booked seats and available seats when the page loads
});

// Call the necessary functions when the DOM content is loaded

// Logout function
function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("expiry");
    window.location.href = "../admin/login.html"; // Redirect to login page
}

// Check if the user is logged in by checking localStorage
const username = localStorage.getItem("username");
if (username) {
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
