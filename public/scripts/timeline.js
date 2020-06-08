const period = 1;

const ctx = document.getElementById('timelineChart').getContext('2d');

fetch('/timeline').then((response) => response.json())
      .then((result) => {

console.log(result)
const timeline = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Jonas',
        data: [
          { x: 0, y: 3 },
          { x: 1.1, y: 3 },
          { x: 3, y: 2.1 },
        ],
        yAxisID: 'y-real',
        xAxisID: 'x-linear',
        fill: 'false',
        steppedLine: 'after',
        backgroundColor: 'rgba(66, 135, 245, 1)',
        borderColor: 'rgba(66, 135, 245, 1)',
      },

      {
        label: 'Martha',
        data: [
          { x: 0, y: 2.9 },
          { x: 0.5, y: 2.9 },
          { x: 2.4, y: 2.9 },
          { x: 3, y: 2.9 },
        ],
        yAxisID: 'y-real',
        xAxisID: 'x-linear',
        fill: 'false',
        spanGaps: true,
        steppedLine: 'after',
        backgroundColor: 'rgba(181, 87, 207, 1)',
        borderColor: 'rgba(181, 87, 207, 1)',
      },
    ],
  },

  options: {
    scales: {
      xAxes: [{
        type: 'category',
        id: 'x-perceived',
        offset: true,
        labels: result.periods[period].dates.map((d) => {
          return(d.date);
        }),
        gridLines: {
          offsetGridLines: true
        }
      },
      {
        type: 'linear',
        display: false,
        id: 'x-linear',
        offset: true,
        ticks: {
          min: 0,
          max: result.periods[period].dates.length,
        },
        gridLines: {
          offsetGridLines: true
        }
      },

      ],
      yAxes: [{
        type: 'category',
        id: 'y-real',
        offset: true,
        gridLines: {
          lineWidth: 4,
          color: 'rgba(181, 181, 181, 1)',
          zeroLineWidth: 4,
          zeroLineColor: 'rgba(181, 181, 181, 1)',
          offsetGridLines: true,
          drawBorder: false,
        },
        ticks: {
          min: 0,
          max: result.periods[period].timelines.length,
          fontFamily: 'Arial',
          fontSize: '18', // 20 works better if rotated
          // labelOffset: -20,     // Need to shift up if rotated
          // minRotation: 90
        },
        labels: result.periods[period].timelines,
      }],
    },

    legend: {
      position: 'right',
    },

    tooltips: {
      mode: 'x',
      intersect: true,
    },
  },
});

})