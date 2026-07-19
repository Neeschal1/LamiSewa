document.addEventListener("DOMContentLoaded", () => {

    const el = document.querySelector("#revenueChart");
    if (!el) return;

    new ApexCharts(el, {

        chart:{
            type:"line",
            height:360,
            toolbar:{show:false},
            zoom:{enabled:false}
        },

        series:[{
            name:"Revenue",
            data:[
                25000,30000,42000,39000,
                52000,61000,70000,85000,
                78000,92000,98000,105000
            ]
        }],

        stroke:{
            curve:"smooth",
            width:4
        },

        markers:{
            size:5,
            hover:{size:8}
        },

        grid:{
            borderColor:"#E5E7EB",
            strokeDashArray:5
        },

        dataLabels:{enabled:false},

        xaxis:{
            categories:[
                "Jan","Feb","Mar","Apr",
                "May","Jun","Jul","Aug",
                "Sep","Oct","Nov","Dec"
            ]
        },

        yaxis:{
            labels:{
                formatter:value=>"Rs "+value.toLocaleString()
            }
        },

        tooltip:{
            y:{
                formatter:value=>"Rs "+value.toLocaleString()
            }
        }

    }).render();

});