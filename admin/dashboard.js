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

// For the doughnut chart
const ctxDoughnut = document.getElementById('myDoughnutChart').getContext('2d');

const dataDoughnut = {
    labels: [
        'Red',
        'Blue',
        'Yellow'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};

const configDoughnut = {
    type: 'doughnut',
    data: dataDoughnut,
};

const myDoughnutChart = new Chart(ctxDoughnut, configDoughnut);

// For another chart type (e.g., line chart)
const ctxLine = document.getElementById('myLineChart').getContext('2d');

// Line chart data and config here...
