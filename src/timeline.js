import Chart from 'chart.js'
import {merge} from 'lodash'
import tinycolor from 'tinycolor2';
import {characterSort, formatName} from '../helpers'

const urlParams = new URLSearchParams(window.location.search);
const app = document.getElementById("timeline");

// Determine period from URL parameters or by default
let p = 1;  // p is period number
if(urlParams.has('p')){
  p = urlParams.get('p');
  if(Number.isNaN(Number(p))){
    p = 1;
  }
  else{
    p = Number(p);
  }
}

let shownDatasets = [];
let spoiler = false;

// Set some basic default settings for datasets
merge(Chart.defaults, {
  global: {
    datasets: {
      line: {
        fill: 'false',
        steppedLine: 'after',
        yAxisID: 'y-real',
        xAxisID: 'x-linear',
        steppedLine: 'middle',
        borderWidth: 5,
        pointRadius: 4,
        pointHoverRadius: 5,
        hoverBorderWidth: 3,
        pointStyle: function(context){      // could do this as a defined function, but it's so much shorter :(
          let index = context.dataIndex;
          let point = context.dataset.data[index];
          if(!["", "break"].includes(point.event.chartIcon)){
            return(point.event.chartIcon)
          }
          else{
            return("circle")
          }
        },
      }
    }
  }
})

// Legend callback - what happens when we click on a legend item
let newLegendOnClick = function (e, legendItem) {
  const index = legendItem.datasetIndex;
  const ci = this.chart;
  let meta = ci.getDatasetMeta(index);

  // Do the default behavior (show/hide dataset)
  if(meta.hidden === null){
    meta.hidden = !ci.data.datasets[index].hidden
  } else{
    meta.hidden = null;
  }

  ci.update();

  // Add/remove dataset from master list of visible datasets
  if(shownDatasets.includes(index)){
    shownDatasets.splice(shownDatasets.indexOf(index), 1)
  }
  else{
    shownDatasets.push(index)
    shownDatasets.sort((a, b) => a - b);
  }

  // Re-generate offsets
  generateOffsets(ci, shownDatasets);

}

//
//   TOOLTIP CALLBACK: Render code for tooltips
//

let eventTooltip = function(tooltipModel){
  var tooltipEl = document.getElementById('chartjs-tooltip')

  // If there isn't a tooltip, create one
  if(!tooltipEl){
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.classList = ['card']
    tooltipEl.innerHTML = '<div class="card-body"> <h6 id="ttHeader" class="card-title"></h6><p id="ttBody" class="card-text"></p> </div> <div class="card-footer text-muted" id="ttFooter"></div>';
    document.body.appendChild(tooltipEl);
  }

  // If there shouldn't be a tooltip, get rid of it
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
      tooltipEl.classList.add('no-transform');
  }

  // Set text?
  if(tooltipModel.body){
    const char = this._chart.data.datasets[tooltipModel.dataPoints[0].datasetIndex]
    const event = char.data[tooltipModel.dataPoints[0].index].event
    const header = document.getElementById('ttHeader');
    const content = document.getElementById('ttBody');
    const footer = document.getElementById('ttFooter');
    header.innerHTML = event.name;
    content.innerHTML = event.description;
    footer.innerHTML = "<div><strong>Character: </strong>"+formatName(char.character, true)+"</div>"

    if(event.location){
      footer.innerHTML = footer.innerHTML+" <div><strong>Location: </strong>"+event.location+"</div>"
    }
    if(event.methodOfTravel){
      footer.innerHTML = footer.innerHTML+" <div><strong>Method Of Time Travel: </strong>"+event.methodOfTravel+"</div>"
    }

  }

  // `this` will be the overall tooltip
  const position = this._chart.canvas.getBoundingClientRect();

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
  tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
  tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
  tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
  //tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
  tooltipEl.style.pointerEvents = 'none';
}

//
//   INIT TIMELINE: Create axes, options, set callbacks
//

let Timeline = new Chart(app, {
  type: "line",
  data: {},
  options: {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'category',
        id: 'x-perceived',
        offset: true,
        ticks:{
          min: 0,
          fontColor: "#f1f1f1",
        },
        gridLines: {
          offsetGridLines: true
        },
        scaleLabel: {
          fontColor: "#f1f1f1",
        }
      },
      {
        type: 'linear',
        display: false,
        id: 'x-linear',
        ticks: {
          min: 0,
        },
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
          //min: 0,
          fontFamily: 'Arial',
          fontColor: "#f1f1f1",
          fontSize: '18', // 20 works better if rotated
          // labelOffset: -20,     // Need to shift up if rotated
          // minRotation: 90
        },
        scaleLabel: {
          fontColor: "#f1f1f1",
        }
      }],
    },

    legend: {
      position: 'right',
      onClick: newLegendOnClick,
      labels:{
        fontColor: "#f1f1f1",
        fontSize: 14,
      },

    },

    tooltips: {
      enabled: false,
      mode: "nearest",
      intersect:true,
      custom: eventTooltip,
    },
  },
})


//
//   FETCH DATA: Get all timeline information, input it into the chart 
//

fetch("/timeline/"+p).then((response) => response.json()).then((result) => {

  // Set scale based on period data - labels, min/max
  Timeline.options.scales.xAxes[0].labels = result.period.dates.map((val) => {return(val.date)})
  Timeline.options.scales.xAxes[1].ticks.max = result.period.dates.length,
  Timeline.options.scales.yAxes[0].labels = result.period.timelines
  Timeline.options.scales.yAxes[0].ticks.min = (result.period.min ? result.period.min : undefined)
  Timeline.options.scales.yAxes[0].ticks.max = (result.period.max ? result.period.max : undefined)
  
  // Init data
  let data = {datasets:[]}

  // Sort the characters using custom function - mostly alphabetical
  result.characters.sort(characterSort)


  data.datasets = result.characters.map((val, i) => {
    if(val.periods[p].events.length > 0){ // make sure there are any events to begin with

      // sort the events AGAIN (serverside actin weird as f with this - DELETE IF I CAN FIGURE OUT HOW)
      val.periods[p].events.sort((a, b) => a.x - b.x)

      // Set linestyle
      let lineStyle = []
      if(val.line == "dashed"){
        lineStyle = [10, 10]
      }
      else if (val.line == "dashdot"){
        lineStyle = [15, 3, 3, 3]
      }

      // Initialize the dataset parameters
      let dataset = {
        label:val["_id"],
        yAxisID: 'y-real', 
        xAxisID: 'x-linear',
        label: formatName(val),                       
        borderDash:lineStyle,
        hidden: !val.periods[p].default,      // This technically shouldn't work like this, really should chart.getDatasetMeta(i), but it works for now
        data: val.periods[p].events.map((event, j) => { // Initialize each datasets
          return({
            x:(event.chartIcon == "break" ? null : event.x),  // x position
            ox:(event.x),                                     // original x position
            y:(event.y),                                      // y position (changes all the time)
            oy:(event.y),                                     // original y position
            event:event                                       // event document - used for tooltips
          })
        }),
        backgroundColor: tinycolor(val.color).toRgbString(),  //turn colors into rgb strings
        borderColor: tinycolor(val.color).toRgbString(),
        character: Object.assign({}, val, {periods: undefined}), // character document WITHOUT period/event data
      }

      // Configure toStart and toEnds - add a new datapoint beyond the graph if true
      if(val.periods[p].toStart){
        const firstEl = dataset.data[0];
        dataset.data.splice(0, 0, {
          x:(-.1),
          ox:(-.1),
          y:(firstEl.y),
          oy:(firstEl.oy),
          event:(firstEl.event)
        })
      }
      if(val.periods[p].toEnd){
        const lastEl = dataset.data[dataset.data.length - 1];
        dataset.data.push({
          x:(result.period.dates.length + .1),
          ox:(result.period.dates.length + .1),
          y:(lastEl.y),
          oy:(lastEl.oy),
          event:(lastEl.event)
        })
      }

      // Return the completed dataset
      return(dataset);
    }
    else{
      return(null)
    }
  })

  // Get rid of any null datasets (characters with no events this season)
  data.datasets = data.datasets.filter((el) => {return el != null});

  // Add non-hidden (shown default) datasets to master list of active sets
  shownDatasets = data.datasets.map((val, i) => {
    if(!val.hidden){
      return i;
    }
    else{
      return null;
    }
  })

  // then get rid of the null values (so dumb)
  shownDatasets = shownDatasets.filter((el) => {return el != null});

  // Finally, put the data on the chart
  Timeline.data = data;
  Timeline.update();

  generateOffsets(Timeline.chart, shownDatasets)
  
})


// Input: chart object, list of shown datasets. Calculates offsets and applies to each dataset. SUPER IMPURE!
function generateOffsets(ci, s){
  let s2 = s.sort((a, b) => ci.data.datasets[a].data[0].x - ci.data.datasets[b].data[0].x)
  ci.data.datasets.forEach((set, i) => {
    if(s.includes(i)){
      set.data.forEach((point) => {
        point.y=( ((( 1 / (s.length+1))* (s2.indexOf(i)+1)) + -0.5 )+point.oy ).toFixed(3);
      })
    }
  })
  ci.update();
}