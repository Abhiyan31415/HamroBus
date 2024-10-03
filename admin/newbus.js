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
  const newRow = table.insertRow(table.rows.length - 1); // Add before the "Add details" button row

  // Insert cells into the new row
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4);
  const cell6 = newRow.insertCell(5);
  const cell7 = newRow.insertCell(6);
  console.log(cell7,cell1,cell2,cell3,cell4,cell5,cell6);

  // Fill cells with form data
  const rowCount = table.rows.length - 1; // Adjust for 0-based index
  cell1.innerHTML = rowCount;
  cell2.innerHTML = busName;
  cell3.innerHTML = originLocation;
  cell4.innerHTML = destination;
  cell5.innerHTML = departureTime;
  cell6.innerHTML = seatCapacity;

  // Add edit and delete buttons in the Actions column
  cell7.innerHTML = `<span style="margin-right: 10px;"><i class="fa fa-pen"></i></span>
                     <span><i class="fa fa-trash" aria-hidden="true"></i></span>`;

  // Clear form fields after submission
  document.getElementById("busForm").reset();
});