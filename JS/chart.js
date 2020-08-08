// for modifying refresh chart
var refreshChart = null;
var refreshUrl = url_hour;
var interval = 60000;
// for modifying bar chart
var barChart = null;
var barUrl = url_week;

function formToggle(str){
    switch(str){
        case 'type': 
            displayClass('type-form');
            hideClass('plot-form');
            break;
        case 'plot':
            hideClass('type-form');
            displayClass('plot-form');
            break;
        default:
    }
}

async function createPlot(formID, chartID, infoID){
    let form = document.getElementById(formID);
    let err = document.getElementById('error-output');
    let start = form.elements['startTime'].valueAsNumber;
    let end = form.elements['endTime'].valueAsNumber;
    if(isNaN(start)){
      err.innerHTML = `Please enter a valid start time.`
    }
    else if(isNaN(end)){
      err.innerHTML = `Please enter a valid end time.`
    }
    else if(start >= end){
      err.innerHTML = `Start time cannot be later than end time.`
    }
    else{
        err.innerHTML = ``;
        start = moment(start);
        end = moment(end);

        getViaLocTime(form.elements['minLat'].value, form.elements['minLong'].value,
        form.elements['maxLat'].value, form.elements['maxLong'].value, start, end)
        .then(data => {
            makeScatterChart(data, chartID, false, start, end);
            setClickHandler(chartID, infoID);
            document.getElementById(infoID).style="display:inline";
        })
        .catch(reason => console.log(reason.message));
    }
}

window.onload = createRefreshChart('refresh-chart');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);
window.onload = createQuakesChart('bar-chart');