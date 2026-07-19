document.addEventListener("DOMContentLoaded",()=>{

    const el=document.querySelector("#genderChart");
    if(!el) return;

    new ApexCharts(el,{

        chart:{
            type:"donut",
            height:320
        },

        series:[58,39,3],

        labels:["Male","Female","Other"],

        colors:[
            "#3B82F6",
            "#EC4899",
            "#10B981"
        ],

        legend:{
            show:false
        },

        stroke:{
            width:0
        },

        dataLabels:{
            enabled:true,
            formatter:val=>val.toFixed(1)+"%"
        },

        plotOptions:{
            pie:{
                donut:{
                    size:"72%",
                    labels:{
                        show:true,
                        total:{
                            show:true,
                            label:"Users",
                            formatter:()=> "100%"
                        }
                    }
                }
            }
        }

    }).render();

});