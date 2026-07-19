document.addEventListener("DOMContentLoaded",()=>{

    const el=document.querySelector("#matchChart");
    if(!el) return;

    new ApexCharts(el,{

        chart:{
            type:"bar",
            height:320,
            toolbar:{show:false}
        },

        series:[{
            name:"Matches",
            data:[
                120,160,180,210,
                260,240,280,320,
                350,390,420,470
            ]
        }],

        colors:["#EC4899"],

        plotOptions:{
            bar:{
                borderRadius:8,
                columnWidth:"45%"
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
                "Jan","Feb","Mar","Apr",
                "May","Jun","Jul","Aug",
                "Sep","Oct","Nov","Dec"
            ]
        }

    }).render();

});