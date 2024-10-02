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

document.addEventListener('DOMContentLoaded', () => {
  const viewAllButton = document.querySelector('.view-all-btn'); // Updated to class selector
  const cards = document.querySelectorAll('.card');

  // Initially show only the first 3 cards
  cards.forEach((card, index) => {
    if (index >= 3) {
      card.style.display = 'none'; // Hide all cards except the first 3
    }
  });

  // Add click event listener to the "View More" button
  viewAllButton.addEventListener('click', () => {
    if (viewAllButton.textContent === 'View More') {
      // Show all cards
      cards.forEach(card => {
        card.style.display = 'block'; // Show all cards
      });
      viewAllButton.textContent = 'View Less'; // Change button text to "View Less"
    } else {
      // Hide all cards except the first 3
      cards.forEach((card, index) => {
        if (index >= 3) {
          card.style.display = 'none'; // Hide all cards except the first 3
        }
      });
      viewAllButton.textContent = 'View More'; // Change button text back to "View More"
    }
  });
});
