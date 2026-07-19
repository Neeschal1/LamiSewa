// Dummy data for now
// Later we'll replace it with Django data.

const signupChart = new ApexCharts(
  document.querySelector("#signupChart"),

  {
    chart: {
      type: "area",

      height: 400,

      toolbar: {
        show: false,
      },

      zoom: {
        enabled: false,
      },
    },

    series: [
      {
        name: "Users",

        data: [
          21, 35, 42, 53, 61, 72, 81, 96, 84, 77, 95, 101, 118, 122, 140, 155,
          148, 163, 172, 181, 196, 210, 223, 240, 236, 252, 270, 281, 295, 310,
        ],
      },
    ],

    stroke: {
      curve: "smooth",

      width: 4,
    },

    fill: {
      type: "gradient",

      gradient: {
        shadeIntensity: 1,

        opacityFrom: 0.45,

        opacityTo: 0.05,

        stops: [0, 90, 100],
      },
    },

    markers: {
      size: 0,
    },

    grid: {
      borderColor: "#e5e7eb",

      strokeDashArray: 5,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",

        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",

        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
      ],
    },

    yaxis: {
      labels: {
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },

    tooltip: {
      theme: "light",
    },
  },
);

const revenueChart = new ApexCharts(
  document.querySelector("#revenueChart"),

  {
    chart: {
      height: 360,

      type: "line",

      toolbar: {
        show: false,
      },

      zoom: {
        enabled: false,
      },
    },

    series: [
      {
        name: "Revenue",

        data: [
          25000, 30000, 42000, 39000, 52000, 61000, 70000, 85000, 78000, 92000,
          98000, 105000,
        ],
      },
    ],

    stroke: {
      curve: "smooth",

      width: 4,
    },

    markers: {
      size: 5,

      hover: {
        size: 8,
      },
    },

    grid: {
      borderColor: "#E5E7EB",

      strokeDashArray: 5,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },

    yaxis: {
      labels: {
        formatter: function (value) {
          return "Rs " + value.toLocaleString();
        },
      },
    },

    tooltip: {
      y: {
        formatter: function (value) {
          return "Rs " + value.toLocaleString();
        },
      },
    },
  },
);

revenueChart.render();

signupChart.render();
