// Drawer functionality
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawer-close");
// const row=[];
// Open drawer when hamburger is clicked
hamburger.addEventListener("click", () => {
    drawer.classList.add("open");
});

// Close drawer when close button is clicked
drawerClose.addEventListener("click", () => {
    drawer.classList.remove("open");
});

// Add Bus form toggling
const addDetailsBtn = document.getElementById("addDetailsBtn");
const formContainer = document.getElementById("formContainer");

addDetailsBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action (if it's inside a form or a link)

    // Toggle the form visibility
    formContainer.style.display = "block";

    // Optionally, scroll to the form if it's not visible in the current viewport
    formContainer.scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/buses")
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetched data:", data);
            renderTable(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
});
function renderTable(data) {
    
    index = 1;
    const table = document.querySelector("table tbody");
    data.forEach((bus) => {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        row.setAttribute("data-bus-id", bus.rowNumber);
        // Add more cells as needed
        cell1.innerHTML = index;
        cell2.innerHTML = bus.busName;
        cell3.innerHTML = bus.fromLocation;
        cell4.innerHTML = bus.toLocation;
        cell5.innerHTML = isoToTime(bus.arrivalTime);
        cell6.innerHTML = bus.availableSeats;
        cell7.innerHTML = `
      <button class="edit-btn" data-editing="false"><i class="fa fa-pen"></i></button>
      <button class="delete-btn"><i class="fa fa-trash"></i></button>
     `;
        // Add more cell data as needed
        index++;
    });
}

// Handling form submission and adding new row
// Handling form submission and adding new row
document.getElementById("busForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get values from the form (including those not in the table)
    const busName = document.getElementById("busName").value;
    const originLocation = document.getElementById("originLocation").value;
    const destination = document.getElementById("destination").value;
    let departureTime = document.getElementById("departureTime").value;
    const seatCapacity = document.getElementById("seatCapacity").value;
    const routeNumber = document.getElementById("routeNumber").value;
    const fare = document.getElementById("fare").value;
    let date = document.getElementById("date").value;
    let fdate=document.getElementById("fdate").value;
    let arrivalTime = document.getElementById("arrivalTime").value;

    // Prepare data to send to the server

    // Get the table
    const table = document.querySelector("table tbody");

    // Create a new row (only for table columns)
    const newRow = table.insertRow(table.rows.length);

    // Insert only the relevant cells into the new row (for table display)
    const cell1 = newRow.insertCell(0); // Row number
    const cell2 = newRow.insertCell(1); // Bus name
    const cell3 = newRow.insertCell(2); // Origin location
    const cell4 = newRow.insertCell(3); // Destination
    const cell5 = newRow.insertCell(4); // Departure time
    const cell6 = newRow.insertCell(5); // Seat capacity
    const cell7 = newRow.insertCell(6); // Actions (edit/delete)

    // Fill cells with form data
    const rowCount = table.rows.length;
    cell1.innerHTML = rowCount;
    cell2.innerHTML = busName;
    cell3.innerHTML = originLocation;
    cell4.innerHTML = destination;
    cell5.innerHTML = departureTime;
    cell6.innerHTML = seatCapacity;
    date = formatDateToMMDDYYYY(date);
    arrivalTime = convertToISO(date, arrivalTime);
    departureTime = convertToISO(date, departureTime);
    console.log(rowCount);
    const datarow = {
        rowCount,
        busName,
        originLocation,
        destination,
        departureTime,
        seatCapacity,
        routeNumber,
        fare,
        date,
        fdate,
        arrivalTime,
    };
    // Add edit and delete buttons in the Actions column
    cell7.innerHTML = `
      <button class="edit-btn" data-editing="false"><i class="fa fa-pen"></i></button>
      <button class="delete-btn"><i class="fa fa-trash"></i></button>
   
  `;

    // Push the form data (including non-table fields) to the server
    pushTableData(datarow);

    // Clear form fields after submission
    document.getElementById("busForm").reset();
    formContainer.style.display = "none";
});

// Handle Edit and Delete using Event Delegation
document
    .querySelector("table tbody")
    .addEventListener("click", function (event) {
      const target = event.target;

      // Edit button functionality
      if (target.closest(".edit-btn")) {
          const editButton = target.closest(".edit-btn");
          const row = editButton.closest('tr');
          const cells = row.querySelectorAll('td:not(:last-child)'); // All cells except the last (actions)
          const rowNumber = row.getAttribute('data-bus-id'); // Get the bus ID from the data attribute
  
          if (editButton.getAttribute("data-editing") === "false") {
              // Change cells to input fields for editing
              cells.forEach((cell, index) => {
                  const cellValue = cell.innerText;
                  cell.innerHTML = `<input type="text" value="${cellValue}" />`;
              });
  
              // Update button to indicate save mode
              editButton.innerHTML = '<i class="fa fa-save"></i>';
              editButton.setAttribute("data-editing", "true");
          } else {
              // Save edited values
              const updatedData = {};
              cells.forEach((cell, index) => {
                  const input = cell.querySelector('input');
                  if (input) {
                      updatedData[index] = input.value; // Store updated value
                      cell.innerHTML = input.value; // Update the cell
                  }
              });
              
              // Prepare the data for the update
              const updatedRowData = {
                  rowNumber: rowNumber, // Include the bus ID to identify the record
                  busName: updatedData[1],
                  originLocation: updatedData[2],
                  destination: updatedData[3],
                  departureTime: convertToISO(new Date().toISOString().split('T')[0], updatedData[4]), // Convert to ISO if needed
                  seatCapacity: updatedData[5],
            
              };
  
              // Call the function to update the bus in the database
              updateBus(updatedRowData);
  
              // Revert button back to edit mode
              editButton.innerHTML = '<i class="fa fa-pen"></i>';
              editButton.setAttribute("data-editing", "false");
          }
      }
        // Delete button functionality
        if (target.closest(".delete-btn")) {
            const row = target.closest("tr");
            const rowNumber = row.getAttribute("data-bus-id");
            row.remove(); // Remove the row
            deleteBus(rowNumber);
        }
        // if(target.closest(".view-btn")){
        //     const row = target.closest("tr");
        //     const rowNumber = row.getAttribute("data-bus-id");
        //     localStorage.setItem("rowNumber", rowNumber);
        //     fetchBusDetails();
        //     //window.location.href = `/admin/busdetails.html`;
        // }

    });
async function deleteBus(rowNumber) {
    try {
        const response = await fetch(`/api/buses/row/${rowNumber}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.message); // You can handle the success message as needed

        // Optionally, refresh the bus list or update the UI
    } catch (error) {
        console.error("Failed to delete bus:", error);
    }
}


async function updateBus(updatedRowData) {
  try {
      const response = await fetch(`/api/buses/${updatedRowData.rowNumber}`, {
          method: 'PUT', // Use PUT for updates
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRowData), // Send the updated data as JSON
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message); // Handle success response as needed
  } catch (error) {
      console.error("Failed to update bus:", error);
  }
}






// Example usage: Pass the row number to delete// Replace with the actual row number you want to delete

function pushTableData(datarow) {
    // Extract all form data
    const rowData = {
        rowNumber: datarow.rowCount,
        busName: datarow.busName,
        originLocation: datarow.originLocation,
        destination: datarow.destination,
        departureTime: datarow.departureTime,
        seatCapacity: datarow.seatCapacity,
        routeNumber: datarow.routeNumber,
        fare: datarow.fare,
        date: datarow.date,
        fdate: datarow.fdate,
        arrivalTime: datarow.arrivalTime,
    };

    console.log(JSON.stringify(rowData));

    // Send the row data to the server using fetch
    fetch("/api/newbus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Data successfully sent to server:", data);
            // Optionally, handle response or display success message to the user
        })
        .catch((error) => {
            console.error("Error sending data:", error);
            // Optionally, handle errors or display an error message to the user
        });
}
function formatDateToMMDDYYYY(rawDate) {
    const [year, month, day] = rawDate.split("-");
    return `${month}/${day}/${year}`; // Return formatted date
}
function convertToISO(date, time) {
    // Combine date and time into one string
    const combinedDateTime = `${date} ${time}`;

    // Create a new Date object from the combined string
    const dateObj = new Date(combinedDateTime);

    // Convert the Date object to ISO 8601 format (UTC)
    const isoString = dateObj.toISOString();

    return isoString;
}
function isoToTime(isoString) {
    const date = new Date(isoString); // Create a new Date object from the ISO string

    // Extract hours, minutes, and seconds
    let hours = date.getHours().toString().padStart(2, "0"); // Add leading zero if needed
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");

    // Format the time string as HH:MM:SS
    return `${hours}:${minutes}`;
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
 

//   async function fetchBusDetails() {
//     try {
//         const response = await fetch('/api/busdetails', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ rowNumber: localStorage.getItem('rowNumber') }) // Replace with actual row number
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }

//         const data = await response.json();
//         console.log(data);

//         // Create a formatted string from the response data
//         const formattedData = `
//         Bus Details Report
//         =========================
//         Route Number: ${data.routeNumber}
//         Bus Name: ${data.busName}
//         Departure Time: ${new Date(data.departureTime).toLocaleString()}
//         Arrival Time: ${new Date(data.arrivalTime).toLocaleString()}
//         From: ${data.fromLocation} To: ${data.toLocation}
//         Travel Date: ${data.travelDate}
//         Arrival Date: ${data.arrivalDate}
        
//         Available Seats: ${data.availableSeats} (Price: ${data.price} NPR)
        
//         Seats:
//         ${data.seats.join(', ')}

//         Reserved Seats Info:
//         =========================
//         ${data.seatsInfo.map(seat => `Seat: ${seat.sea}, Username: ${seat.username}, Contact: ${seat.contact}`).join('\n')}
//         `;

//         // Create a text file with the formatted data
//         const blob = new Blob([formattedData], { type: 'text/plain' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'bus_details.txt'; // Name of the downloaded file
//         document.body.appendChild(a);
//         a.click(); // Simulate a click to download the file
//         document.body.removeChild(a); // Clean up
//         URL.revokeObjectURL(url); // Release the object URL
//     } catch (error) {
//         console.error('There has been a problem with your fetch operation:', error);
//     }
// }


