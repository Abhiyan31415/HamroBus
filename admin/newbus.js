// Drawer functionality
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawer-close');

// Open drawer when hamburger is clicked
hamburger.addEventListener('click', () => {
  drawer.classList.add('open');
});

// Close drawer when close button is clicked
drawerClose.addEventListener('click', () => {
  drawer.classList.remove('open');
});

// Add Bus form toggling
const addDetailsBtn = document.getElementById("addDetailsBtn");
const formContainer = document.getElementById("formContainer");

addDetailsBtn.addEventListener("click", function(event) {
  event.preventDefault();  // Prevent default action (if it's inside a form or a link)
  
  // Toggle the form visibility
  formContainer.style.display = "block";
  
  // Optionally, scroll to the form if it's not visible in the current viewport
  formContainer.scrollIntoView({ behavior: 'smooth' });
});

// Handling form submission and adding new row
document.getElementById("busForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  // Get values from the form
  const busName = document.getElementById("busName").value;
  const originLocation = document.getElementById("originLocation").value;
  const destination = document.getElementById("destination").value;
  const departureTime = document.getElementById("departureTime").value;
  const seatCapacity = document.getElementById("seatCapacity").value;

  // Get the table
  const table = document.querySelector("table tbody");

  // Create a new row
  const newRow = table.insertRow(table.rows.length);

  // Insert cells into the new row
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4);
  const cell6 = newRow.insertCell(5);
  const cell7 = newRow.insertCell(6);

  // Fill cells with form data
  const rowCount = table.rows.length; 
  cell1.innerHTML = rowCount;
  cell2.innerHTML = busName;
  cell3.innerHTML = originLocation;
  cell4.innerHTML = destination;
  cell5.innerHTML = departureTime;
  cell6.innerHTML = seatCapacity;

  // Add edit and delete buttons in the Actions column
  cell7.innerHTML = `
      <button class="edit-btn" data-editing="false"><i class="fa fa-pen"></i></button>
      <button class="delete-btn"><i class="fa fa-trash"></i></button>
  `;
  pushTableData();

  // Clear form fields after submission
  document.getElementById("busForm").reset();
  formContainer.style.display = "none";

});

// Handle Edit and Delete using Event Delegation
document.querySelector("table tbody").addEventListener("click", function(event) {
  const target = event.target;

  // Edit button functionality
  if (target.closest(".edit-btn")) {
    const editButton = target.closest(".edit-btn");
    const row = editButton.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)'); // All cells except the last (actions)

    if (editButton.getAttribute("data-editing") === "false") {
      // Change cells to input fields for editing
      cells.forEach(cell => {
        const cellValue = cell.innerText;
        cell.innerHTML = `<input type="text" value="${cellValue}" />`;
      });

      // Update button to indicate save mode
      editButton.innerHTML = '<i class="fa fa-save"></i>';
      editButton.setAttribute("data-editing", "true");
    } else {
      // Save edited values
      cells.forEach(cell => {
        const input = cell.querySelector('input');
        if (input) {
          cell.innerHTML = input.value;
        }
      });

      // Revert button back to edit mode
      editButton.innerHTML = '<i class="fa fa-pen"></i>';
      editButton.setAttribute("data-editing", "false");
    }
  }

  // Delete button functionality
  if (target.closest(".delete-btn")) {
    const row = target.closest("tr");
    row.remove(); // Remove the row
  }
});






function pushTableData() {
  // Get the table rows
  const table = document.querySelector("table tbody");
  const rows = table.querySelectorAll("tr");

  // Initialize an array to store row data
  const tableData = [];

  // Loop through each row and extract data
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td:not(:last-child)"); // Exclude the actions column
    const rowData = {
      rowNumber: cells[0].innerText, // Assuming the first cell is the row number
      busName: cells[1].innerText,
      originLocation: cells[2].innerText,
      destination: cells[3].innerText,
      departureTime: cells[4].innerText,
      seatCapacity: cells[5].innerText
    };
    
    // Push row data to array
    tableData.push(rowData);
  });
  console.log(JSON.stringify(tableData));

  // Send the data to the server using fetch
  fetch('//example//', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tableData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data successfully sent to server:', data);
    // Optionally, handle response or display success message to the user
  })
  .catch(error => {
    console.error('Error sending data:', error);
    // Optionally, handle errors or display an error message to the user
  });
}
