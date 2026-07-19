document.addEventListener("DOMContentLoaded", function () {
  const signupElement = document.querySelector("#signupChart");

  if (signupElement) {
    const signupChart = new ApexCharts(signupElement, {
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
            148, 163, 172, 181, 196, 210, 223, 240, 236, 252, 270, 281, 295,
            310,
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
    });

    signupChart.render();
  }

  const revenueElement = document.querySelector("#revenueChart");

  if (revenueElement) {
    const revenueChart = new ApexCharts(revenueElement, {
      chart: {
        type: "line",
        height: 360,
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
            25000, 30000, 42000, 39000, 52000, 61000, 70000, 85000, 78000,
            92000, 98000, 105000,
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
    });

    revenueChart.render();
  }

  const genderElement = document.querySelector("#genderChart");

  if (genderElement) {
    const genderChart = new ApexCharts(genderElement, {
      chart: {
        type: "donut",
        height: 320,
      },

      series: [58, 39, 3],

      labels: ["Male", "Female", "Other"],

      colors: ["#3B82F6", "#EC4899", "#10B981"],

      legend: {
        show: false,
      },

      stroke: {
        width: 0,
      },

      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + "%";
        },
      },

      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Users",
                formatter: function () {
                  return "100%";
                },
              },
            },
          },
        },
      },

      tooltip: {
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
    });

    genderChart.render();
  }

  const subscriptionElement = document.querySelector("#subscriptionChart");

  if (subscriptionElement) {
    const subscriptionChart = new ApexCharts(subscriptionElement, {
      chart: {
        type: "radialBar",
        height: 320,
      },

      series: [72, 21, 7],

      labels: ["Free", "Premium", "VIP"],

      colors: ["#3B82F6", "#F59E0B", "#8B5CF6"],

      plotOptions: {
        radialBar: {
          hollow: {
            size: "35%",
          },

          dataLabels: {
            name: {
              fontSize: "15px",
            },

            value: {
              fontSize: "22px",
            },
          },
        },
      },

      legend: {
        show: true,
        position: "bottom",
      },
    });

    subscriptionChart.render();
  }

  const matchElement = document.querySelector("#matchChart");

  if (matchElement) {
    const matchChart = new ApexCharts(matchElement, {
      chart: {
        type: "bar",
        height: 320,
        toolbar: {
          show: false,
        },
      },

      series: [
        {
          name: "Matches",
          data: [120, 160, 180, 210, 260, 240, 280, 320, 350, 390, 420, 470],
        },
      ],

      colors: ["#EC4899"],

      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "45%",
        },
      },

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 5,
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
    });

    matchChart.render();
  }

  const verificationElement = document.querySelector("#verificationChart");

  if (verificationElement) {
    const verificationChart = new ApexCharts(verificationElement, {
      chart: {
        type: "radialBar",
        height: 320,
        toolbar: {
          show: false,
        },
      },

      series: [78, 16, 6],

      labels: ["Approved", "Pending", "Rejected"],

      colors: ["#10B981", "#F59E0B", "#EF4444"],

      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,

          hollow: {
            size: "45%",
          },

          track: {
            background: "#F3F4F6",
          },

          dataLabels: {
            name: {
              fontSize: "15px",
            },

            value: {
              fontSize: "22px",
            },
          },
        },
      },

      legend: {
        show: true,
        position: "bottom",
      },

      stroke: {
        lineCap: "round",
      },
    });

    verificationChart.render();
  }

  const ageElement = document.querySelector("#ageChart");

  if (ageElement) {
    const ageChart = new ApexCharts(ageElement, {
      chart: {
        type: "bar",
        height: 320,
        toolbar: {
          show: false,
        },
      },

      series: [
        {
          name: "Users",
          data: [3542, 5291, 2175, 864],
        },
      ],

      colors: ["#6366F1"],

      plotOptions: {
        bar: {
          horizontal: true,

          borderRadius: 8,

          barHeight: "45%",
        },
      },

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 5,
      },

      xaxis: {
        categories: ["18 - 24", "25 - 30", "31 - 35", "36+"],
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " Users";
          },
        },
      },
    });

    ageChart.render();
  }
});
