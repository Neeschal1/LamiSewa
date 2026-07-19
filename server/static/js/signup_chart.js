document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("#signupChart");
    if (!el) return;

    new ApexCharts(el, {
        chart: {
            type: "area",
            height: 400,
            toolbar: { show: false },
            zoom: { enabled: false }
        },

        series: [{
            name: "Users",
            data: [
                21,35,42,53,61,72,81,96,84,77,
                95,101,118,122,140,155,148,163,
                172,181,196,210,223,240,236,
                252,270,281,295,310
            ]
        }],

        stroke: {
            curve: "smooth",
            width: 4
        },

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: .45,
                opacityTo: .05,
                stops: [0,90,100]
            }
        },

        markers: { size: 0 },

        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 5
        },

        dataLabels: { enabled: false },

        xaxis: {
            categories: Array.from({length:30},(_,i)=>`${i+1}`)
        },

        yaxis: {
            labels: {
                formatter: value => Math.round(value)
            }
        }

    }).render();
});