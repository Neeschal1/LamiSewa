document.addEventListener("DOMContentLoaded",()=>{

    const el=document.querySelector("#verificationChart");
    if(!el) return;

    new ApexCharts(el,{

        chart:{
            type:"radialBar",
            height:320,
            toolbar:{show:false}
        },

        series:[78,16,6],

        labels:[
            "Approved",
            "Pending",
            "Rejected"
        ],

        colors:[
            "#10B981",
            "#F59E0B",
            "#EF4444"
        ],

        plotOptions:{
            radialBar:{
                startAngle:-135,
                endAngle:225,

                hollow:{
                    size:"45%"
                },

                track:{
                    background:"#F3F4F6"
                },

                dataLabels:{
                    name:{fontSize:"15px"},
                    value:{fontSize:"22px"}
                }
            }
        },

        stroke:{
            lineCap:"round"
        },

        legend:{
            show:true,
            position:"bottom"
        }

    }).render();

});