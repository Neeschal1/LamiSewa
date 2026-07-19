document.addEventListener("DOMContentLoaded",()=>{

    const el=document.querySelector("#ageChart");
    if(!el) return;

    new ApexCharts(el,{

        chart:{
            type:"bar",
            height:320,
            toolbar:{show:false}
        },

        series:[{
            name:"Users",
            data:[
                3542,
                5291,
                2175,
                864
            ]
        }],

        colors:["#6366F1"],

        plotOptions:{
            bar:{
                horizontal:true,
                borderRadius:8,
                barHeight:"45%"
            }
        },

        dataLabels:{
            enabled:false
        },

        grid:{
            borderColor:"#E5E7EB",
            strokeDashArray:5
        },

        xaxis:{
            categories:[
                "18 - 24",
                "25 - 30",
                "31 - 35",
                "36+"
            ]
        },

        tooltip:{
            y:{
                formatter:value=>value.toLocaleString()+" Users"
            }
        }

    }).render();

});