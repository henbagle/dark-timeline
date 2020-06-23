import {formatName} from '../helpers'

//   TOOLTIP CALLBACK: Render code for tooltips
export const tooltipCallback = function(tooltipModel){
    let tooltipEl = document.getElementById('chartjs-tooltip')
  
    // If there isn't a tooltip, create one
    if(!tooltipEl){
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.classList.add('card', 'text-white', 'bg-dark')
      tooltipEl.innerHTML = '<div class="card-body"> <h5 id="ttHeader" class="card-title"></h5><p id="ttBody" class="card-text"></p> </div> <div class="card-footer text-muted" id="ttFooter"></div>';
      document.body.appendChild(tooltipEl);
    }
  
    // If there shouldn't be a tooltip, get rid of it
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set text
    if(tooltipModel.body){
      const char = this._chart.data.datasets[tooltipModel.dataPoints[0].datasetIndex]
      const event = char.data[tooltipModel.dataPoints[0].index].event

      const header = document.getElementById('ttHeader');
      const content = document.getElementById('ttBody');
      const footer = document.getElementById('ttFooter');

      header.innerHTML = event.name;
      content.innerHTML = event.description;

      footer.innerHTML = "<div><strong>"+formatName(char.character, true)+"</strong></div>"
      if(event.location){
        footer.innerHTML = footer.innerHTML+" <div><strong>Location: </strong>"+event.location+"</div>"
      }
      if(event.methodOfTravel){
        footer.innerHTML = footer.innerHTML+" <div><strong>Method Of Time Travel: </strong>"+event.methodOfTravel+"</div>"
      }
  
    }
  
    // `this` will be the overall tooltip
    const position = this._chart.canvas.getBoundingClientRect();
  
    // Do a bit of window size math to figure out if the tooltip should be above or below the point
    let y = (position.top + window.pageYOffset + tooltipModel.caretY + 20)
  
    if((tooltipEl.clientHeight + y) > window.innerHeight){
      y = y - tooltipEl.clientHeight - 40;
    }
    
    // same thing for left side
    let x = (position.left + window.pageXOffset + tooltipModel.caretX - 160)
    if(x < 0){
      x = (x - x) + 20;
    }
  
    if ((tooltipEl.clientHeight + x) > window.innerWidth){
      x = x - (window.innerWidth - (tooltipEl.clientHeight + x) - 20);
    }
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top = y + 'px';
    //tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
} 