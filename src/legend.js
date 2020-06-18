// Legend callback - what happens when we click on a legend item
export const oldCallback = function (e, legendItem) {
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

export function htmlLegend(chart, callback){
    const legendContainer = document.getElementById("legendContent");
    
    //generate HTML legend
    legendContainer.innerHTML = chart.generateLegend();
    
    // bind onClick event to all LI-tags of the legend
    const legendItems = legendContainer.getElementsByTagName('li');
    for (let i = 0; i < legendItems.length; i += 1) {
        let childSpan= legendItems[i].getElementsByTagName('span')[0]
        legendItems[i].addEventListener("click", callback, false);
        childSpan.style.borderColor = childSpan.style.backgroundColor
        if(!chart.shownDatasets.includes(i)){
            legendItems[i].classList.add("hidden")
        }
    }
}