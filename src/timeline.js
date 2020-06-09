import React from 'react';
import ReactDOM from "react-dom";
import { Chart , Line , defaults } from 'react-chartjs-2';
import { merge } from 'lodash';

const urlParams = new URLSearchParams(window.location.search);
let p = 1;
if(urlParams.has('p')){
  p = urlParams.get('p');
  if(Number.isNaN(p)){
    p = 1;
  }
  else{
    p = Number(p);
  }
}

merge(defaults, {
  global: {
    datasets: {
      line: {
        fill: 'false',
        steppedLine: 'after',
        yAxisID: 'y-real',
        xAxisID: 'x-linear',
        steppedLine: 'after',
      }
    }
  }
})




// console.log(result)
// const timeline = new Chart(ctx, {
//   type: 'line',
//   data: {
//     datasets: [
//       {
//         label: 'Jonas',
//         data: [
//           { x: 0, y: 3 },
//           { x: 1.1, y: 3 },
//           { x: 3, y: 2.1 },
//         ],
//         yAxisID: 'y-real',
//         xAxisID: 'x-linear',
//         fill: 'false',
//         steppedLine: 'after',
//         backgroundColor: 'rgba(66, 135, 245, 1)',
//         borderColor: 'rgba(66, 135, 245, 1)',
//       },

//       {
//         label: 'Martha',
//         data: [
//           { x: 0, y: 2.9 },
//           { x: 0.5, y: 2.9 },
//           { x: 2.4, y: 2.9 },
//           { x: 3, y: 2.9 },
//         ],
//         yAxisID: 'y-real',
//         xAxisID: 'x-linear',
//         fill: 'false',
//         spanGaps: true,
//         steppedLine: 'after',
//         backgroundColor: 'rgba(181, 87, 207, 1)',
//         borderColor: 'rgba(181, 87, 207, 1)',
//       },
//     ],
//   },

//   options: {
//     scales: {
//       xAxes: [{
//         type: 'category',
//         id: 'x-perceived',
//         offset: true,
//         labels: result.periods[period].dates.map((d) => {
//           return(d.date);
//         }),
//         gridLines: {
//           offsetGridLines: true
//         }
//       },
//       {
//         type: 'linear',
//         display: false,
//         id: 'x-linear',
//         offset: true,
//         ticks: {
//           min: 0,
//           max: result.periods[period].dates.length,
//         },
//         gridLines: {
//           offsetGridLines: true
//         }
//       },

//       ],
//       yAxes: [{
//         type: 'category',
//         id: 'y-real',
//         offset: true,
//         gridLines: {
//           lineWidth: 4,
//           color: 'rgba(181, 181, 181, 1)',
//           zeroLineWidth: 4,
//           zeroLineColor: 'rgba(181, 181, 181, 1)',
//           offsetGridLines: true,
//           drawBorder: false,
//         },
//         ticks: {
//           min: 0,
//           max: result.periods[period].timelines.length,
//           fontFamily: 'Arial',
//           fontSize: '18', // 20 works better if rotated
//           // labelOffset: -20,     // Need to shift up if rotated
//           // minRotation: 90
//         },
//         labels: result.periods[period].timelines,
//       }],
//     },

//     legend: {
//       position: 'right',
//     },

//     tooltips: {
//       mode: 'x',
//       intersect: true,
//     },
//   },
// });
class DarkTimeline extends React.Component{
  render(){
    return(<h1>Timeline go here!</h1>)
  }
}


ReactDOM.render(
  <DarkTimeline />,
  document.getElementById("app"),
);