// Get elements
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



document.querySelectorAll('.view-seats-btn').forEach(button => {
    button.addEventListener('click', function() {
        alert('View seats functionality to be implemented.');
    });
});
// Handle 'From' dropdown button click
document.getElementById('dropdown-btn').addEventListener('click', function() {
    document.getElementById('from').focus(); // Focus on the input field
  });
  
  // Handle 'To' dropdown button click
  document.getElementById('dropdown-btn-to').addEventListener('click', function() {
    document.getElementById('to').focus(); // Focus on the input field
  });
