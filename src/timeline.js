import 'bootstrap';
import Chart from 'chart.js'
import {merge} from 'lodash'
import tinycolor from 'tinycolor2';
import {characterSort, formatName} from '../helpers'
import * as eventTooltip from './eventTooltip'
import * as darkLegend from './legend'

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

// Set some basic default settings for datasets
merge(Chart.defaults, {
  global: {
    defaultFontFamily:"'Noto Sans KR', sans-serif",
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

//   INIT TIMELINE: Create axes, options, set callbacks
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
          fontColor: "#ffffff",
        },
        gridLines: {
          offsetGridLines: true,
          color: '#4d4d4d',
          lineWidth: 2
        },
        scaleLabel: {
          fontColor: "#ffffff",
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
          color: '#999999',
          zeroLineWidth: 4,
          zeroLineColor: '#999999',
          offsetGridLines: true,
          drawBorder: false,
        },
        ticks: {
          //min: 0,
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
      display: false,
      // position: 'right',
      // onClick: darkLegend.oldCallback,
      // labels:{
      //   fontColor: "#f1f1f1",
      //   fontSize: 14,
      // },

    },

    tooltips: {
      enabled: false,
      mode: "point",
      intersect:true,
      custom: eventTooltip.tooltipCallback,
    },
  },
})


//   FETCH DATA: Get all timeline information, input it into the chart 
fetch("/timeline/"+p).then((response) => response.json()).then((result) => {
  p = result.periodN

  // Set scale based on period data - labels, min/max
  Timeline.options.scales.xAxes[0].labels = result.period.dates.map((val) => {
    if(val.episode){
      return([val.date, val.episode]);
    }
    else{
      return(val.date);
    }
  })
  Timeline.options.scales.xAxes[1].ticks.max = result.period.dates.length,
  Timeline.options.scales.yAxes[0].labels = result.period.timelines
  Timeline.options.scales.yAxes[0].ticks.min = (result.period.emin ? result.period.emin : undefined)
  Timeline.options.scales.yAxes[0].ticks.max = (result.period.emax ? result.period.emax : undefined)

  Timeline.minmax = {}
  Timeline.minmax.min = (result.period.min ? result.period.min : undefined)
  Timeline.minmax.max = (result.period.max ? result.period.max : undefined)
  Timeline.minmax.emin = (result.period.emin ? result.period.emin : undefined)
  Timeline.minmax.emax = (result.period.emax ? result.period.emax : undefined)

  if((Timeline.minmax.emin === undefined) && (Timeline.minmax.emax === undefined)){
    document.getElementById('legendMeta').removeChild(document.getElementById('showExtraTimelinesContainer'));
  }
  
  
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
  Timeline.shownDatasets = data.datasets.map((val, i) => {
    if(!val.hidden){
      return i;
    }
    else{
      return null;
    }
  })

  // then get rid of the null values (so dumb)
  Timeline.shownDatasets = Timeline.shownDatasets.filter((el) => {return el != null});

  // Finally, put the data on the chart
  Timeline.data = data;
  Timeline.update();

  generateOffsets(Timeline)

  // Create the legend
  darkLegend.htmlLegend(Timeline, legendClickCallback)
  
})

window.addEventListener('touchstart', function onFirstTouch() {

  // or set some global variable
  window.USER_IS_TOUCHING = true;

  Timeline.options.tooltips.intersect = false;

  // we only need to know once that a human touched the screen, so we can stop listening now
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

document.getElementById("legendToggle").addEventListener('click', () => {
  const legend = document.getElementById("legend")
  legend.classList.contains("d-none") ? legend.classList.remove("d-none") : legend.classList.add("d-none");
})

document.getElementById('showExtraTimelines').addEventListener('click',  () => {
  const box = document.getElementById('showExtraTimelines')

  if(box.checked){
    Timeline.options.scales.yAxes[0].ticks.min = Timeline.minmax.min
    Timeline.options.scales.yAxes[0].ticks.max = Timeline.minmax.max
  }
  else{
    Timeline.options.scales.yAxes[0].ticks.min = Timeline.minmax.emin
    Timeline.options.scales.yAxes[0].ticks.max = Timeline.minmax.emax
  }

  Timeline.update();
})

function legendClickCallback(event) {     // Callback when clicked on legend item
  event = event || window.event;

  const target = event.target || event.srcElement;
  while (target.nodeName !== 'LI') {
      target = target.parentElement;
  }
  const parent = target.parentElement;
  var chartId = parseInt(parent.classList[0].split("-")[0], 10);
  var chart = Chart.instances[chartId];
  var index = Array.prototype.slice.call(parent.children).indexOf(target);
  chart.legend.options.onClick.call(chart, event, chart.legend.legendItems[index]);
  if (chart.isDatasetVisible(index)) {
    target.classList.remove('hidden');
    chart.shownDatasets.push(index)
    chart.shownDatasets.sort((a, b) => a - b);
  } else {
    chart.shownDatasets.splice(chart.shownDatasets.indexOf(index), 1)
    target.classList.add('hidden');
  }

  generateOffsets(chart)
}

// Input: chart object, list of shown datasets. Calculates offsets and applies to each dataset. SUPER IMPURE!
function generateOffsets(tl){
  const ci = tl.chart
  const s = tl.shownDatasets
  let s2 = s.sort((a, b) => {
    darkFirstElement(ci.data.datasets[a]) - darkFirstElement(ci.data.datasets[b])
  })
  ci.data.datasets.forEach((set, i) => {
    if(s.includes(i)){
      set.data.forEach((point) => {
        point.y=( ((( 1 / (s.length+1))* (s2.indexOf(i)+1)) + -0.5 )+point.oy ).toFixed(3);
      })
    }
  })
  ci.update();
}

function darkFirstElement(dataset){       // Supposedly returns the first x, ignoring the 0th if it is an extend to start
  if(dataset.data[0].x < 0){              // ..... supposedly
    return(dataset.data[1].x);
  }
  return(dataset.data[0].x);
}