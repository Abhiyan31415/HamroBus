async function fetchBusDetails(travelDateInput, routeNumberInput) {
    try {
        const response = await fetch("/api/busdetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ routeNumber: routeNumberInput }), // Send route number
        });

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText
            );
        }

        const data = await response.json();
        console.log("Fetched successfully", data);

        // Format the travel date from "MM-DD-YYYY" to "YYYY-MM-DD" for comparison
        const travelDateParts = data.travelDate.split("-"); // Split into [MM, DD, YYYY]
        const formattedTravelDate = `${travelDateParts[2]}-${travelDateParts[0]}-${travelDateParts[1]}`; // Reformat to YYYY-MM-DD

        if (
            formattedTravelDate === travelDateInput &&
            data.routeNumber === routeNumberInput
        ) {
            // Display the bus details if the input matches
            document.querySelector("h1").textContent = "Bus Details Report";

            // Bus Information
            document.querySelector(".bus-info").innerHTML = `
                <p><strong>Route Number:</strong> ${data.routeNumber}</p>
                <p><strong>Bus Name:</strong> ${data.busName}</p>
                <p><strong>Departure Time:</strong> ${new Date(
                    data.departureTime
                ).toLocaleString()}</p>
                <p><strong>Arrival Time:</strong> ${new Date(
                    data.arrivalTime
                ).toLocaleString()}</p>
                <p><strong>From:</strong> ${data.fromLocation}</p>
                <p><strong>To:</strong> ${data.toLocation}</p>
                <p><strong>Travel Date:</strong> ${data.travelDate}</p>
                <p><strong>Arrival Date:</strong> ${data.arrivalDate}</p>
            `;

            // Seat Availability
            document.querySelector(".seat-availability").innerHTML = `
                <p><strong>Available Seats:</strong> ${data.availableSeats}</p>
                <p><strong>Price:</strong> ${data.price} NPR</p>
                <p><strong>Seats:</strong> ${data.seats.join(", ")}</p>
            `;

            // Reserved Seats Info
            const reservedSeatsInfo = data.seatsInfo
                .map(
                    (seat) => `
                <li><strong>Seat:</strong> ${seat.sea}, <strong>Username:</strong> ${seat.username}, <strong>Contact:</strong> ${seat.contact}</li>
            `
                )
                .join("");

            document.querySelector(".reserved-seats ul").innerHTML =
                reservedSeatsInfo;
        } else {
            // Display message if no match is found
            document.querySelector(
                ".container"
            ).innerHTML = `<p>No bus details found for the given route number and travel date.</p>`;
        }
    } catch (error) {
        console.error(
            "There has been a problem with your fetch operation:",
            error
        );
    }
}

// Function to trigger the print dialog
function printReport() {
    window.print();
}

// Attach the print function to the print button
document.getElementById("print-btn").addEventListener("click", printReport);

// Add event listener to the search button
document.getElementById("search-btn").addEventListener("click", function () {
    const departureDateInput = document.getElementById("bus-date-input").value;
    const routeNumberInput =
        document.getElementById("route-number-input").value;
    console.log(departureDateInput, routeNumberInput);

    // Call the fetchBusDetails function with user input
    fetchBusDetails(departureDateInput, routeNumberInput);
});
