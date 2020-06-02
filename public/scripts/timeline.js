const ctx = document.getElementById('timelineChart').getContext("2d");


let timeline = new Chart(ctx, {
    type: "line",
    data: {
        datasets: [
            {label:"Jonas",
            data:[
                {x: 0, y: 3},
                {x: 1.1, y: 3},
                {x: 3, y: 2.1},
            ],
            yAxisID:"y-real",
            xAxisID:"x-linear",
            fill:"false",
            steppedLine:"after",
            backgroundColor:"rgba(66, 135, 245, 1)",
            borderColor:"rgba(66, 135, 245, 1)"},

            {label:"Martha",
            data:[
                {x: 0, y: 2.9},
                {x: 0.5, y: 2.9},
                {x: 2.4, y: 2.9},
                {x: 3, y: 2.9},
            ],
            yAxisID:"y-real",
            xAxisID:"x-linear",
            fill:"false",
            spanGaps: true,
            steppedLine:"after",
            backgroundColor:"rgba(181, 87, 207, 1)",
            borderColor:"rgba(181, 87, 207, 1)"}
        ],
    },

    options: {
        scales: {
            xAxes:[{
                type: "category",
                id:"x-perceived",
                labels: ["November 4th", "November 5th", "November 6th", ""],
            },
            {
                type: "linear",
                display: false,
                id:"x-linear",
                ticks:{
                    min:0,
                    max:3
                }
            }
        
            ],
            yAxes:[{
                type: "category",
                id: "y-real",
                offset: true,
                gridLines:{
                    lineWidth: 4,
                    color: "rgba(181, 181, 181, 1)",
                    zeroLineWidth: 4,
                    zeroLineColor: "rgba(181, 181, 181, 1)",
                    offsetGridLines: true,
                    drawBorder: false,
                },
                ticks:{
                    min: 0,
                    max: 5,
                    fontFamily: "Arial",
                    fontSize: "18",         // 20 works better if rotated
                    //labelOffset: -20,     // Need to shift up if rotated
                    //minRotation: 90
                },
                labels: ["1920", "1953", "1986", "2019", "2052"]
            }],
        },

        legend:{
            position:"right"
        },

        tooltips:{
            mode: "x",
            intersect: true
        }
    }
    })