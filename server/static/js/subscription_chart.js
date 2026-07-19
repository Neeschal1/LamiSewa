document.addEventListener("DOMContentLoaded",()=>{

    const el=document.querySelector("#subscriptionChart");
    if(!el) return;

    new ApexCharts(el,{

        chart:{
            type:"radialBar",
            height:320
        },

        series:[72,21,7],

        labels:["Free","Premium","VIP"],

        colors:[
            "#3B82F6",
            "#F59E0B",
            "#8B5CF6"
        ],

        plotOptions:{
            radialBar:{
                hollow:{
                    size:"35%"
                },

                dataLabels:{
                    name:{fontSize:"15px"},
                    value:{fontSize:"22px"}
                }
            }
        },

        legend:{
            show:true,
            position:"bottom"
        }

    }).render();

});