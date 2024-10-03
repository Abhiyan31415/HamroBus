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

// For the doughnut chart
const ctxDoughnut1 = document.getElementById("myDoughnutChart").getContext("2d");
const ctxDoughnut2 = document.getElementById("myDoughnutChart2").getContext("2d");
const ctxDoughnut3 = document.getElementById("myDoughnutChart3").getContext("2d");
const ctxDoughnut4 = document.getElementById("myDoughnutChart4").getContext("2d");

const dataDoughnut1 = {
  labels: ["Booked Tickets", "Remaining Tickets Available"],
  datasets: [
    {
      label: "Chart 1",
      data: [300, 100],
      backgroundColor: ["#FDCB58", "#ACD676"],
      hoverOffset: 4,
    },
  ],
};

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
  labels: ["Cities Reached", "Remnaining Targeted Cities"],
  datasets: [
    {
      label: "Chart 3",
      data: [450, 50],
      backgroundColor: ["#283F5E", "#FDCB58"],
      hoverOffset: 4,
    },
  ],
};

const dataDoughnut4 = {
  labels: ["Users Registered", "Remaining Targeted Users"],
  datasets: [
    {
      label: "Chart 4",
      data: [2400, 2100],
      backgroundColor: ["#ACD676", "#FDCB58"],
      hoverOffset: 4,
    },
  ],
};

const configDoughnut1 = {
  type: "doughnut",
  data: dataDoughnut1,
};

const configDoughnut2 = {
  type: "doughnut",
  data: dataDoughnut2,
};

const configDoughnut3 = {
  type: "doughnut",
  data: dataDoughnut3,
};

const configDoughnut4 = {
  type: "doughnut",
  data: dataDoughnut4,
  options: {
    plugins: {
      legend: {
        labels: {
          color: 'white', // Change this to the desired color
         
        }
      }
    }
  }

};

// Create charts
new Chart(ctxDoughnut1, configDoughnut1);
new Chart(ctxDoughnut2, configDoughnut2);
new Chart(ctxDoughnut3, configDoughnut3);
new Chart(ctxDoughnut4, configDoughnut4);



