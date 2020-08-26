
var hourlyQuakes = [];
var dailyQuakeData = [];
var locations = [];

function hourlyChartUpdate(){
    hourlyQuakes = [];
    apiInfo(url_hour)
    .then(data => {
        for(feature of data.features){
            hourlyQuakes.push({x: parseTime(feature.properties.time), y: feature.properties.mag.toFixed(2)})
            locations.push(feature.properties.place);
        }
        hourlyChart.updateSeries([{
            name: "Magnitude",
            data: hourlyQuakes.reverse(),
        }])
    })
    .catch(reason => console.log(reason.message));
}

function quakesPerDayUpdate(){
    dailyQuakeData = [];
    apiInfo(url_week)
    .then(data => {
        let prevDate = moment();
        let quakeCount = 0;
        for(feature of data.features){
            let date = moment(feature.properties.time);
            if(date.format("YYYY-MM-DD") == prevDate.format("YYYY-MM-DD")){
                ++quakeCount;
            }
            else{
                dailyQuakeData.push({x: prevDate.format("dddd, MM/DD"), y:quakeCount});
                quakeCount = 0;
                prevDate = date;
            }

        }
        quakeCountChart.updateSeries([{
            name: "Quakes",
            data: dailyQuakeData.reverse(),
        }])
    })
    .catch(reason => console.log(reason.message));
}

var small = 0;
var mild = 0;
var moderate = 0;
var severe = 0;
function donutUpdate(){
    small = 0;
    mild = 0;
    moderate = 0;
    severe = 0;
    apiInfo(url_week)
    .then(data => {
        for(feature of data.features){
            if(feature.properties.mag <= 2){
                ++small;
            }
            else if(feature.properties.mag > 2 && feature.properties.mag < 5){
                ++mild;
            }
            else if(feature.properties.mag >=5 && feature.properties.mag < 8){
                ++moderate;
            }
            else if(feature.properties.mag >=8){
                ++severe;
            }
        }
        magDonut.updateSeries([small, mild, moderate, severe]);
    })
    .catch(reason => console.log(reason.mesage));
}

var hourlyOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        type: 'area',
        height: '250'
    },
    dataLabels: {
        enabled: false,
    },
    series: [],
    markers: {
        size: 5,
    },
    fill: {
        colors: "rgb(255, 150, 0)",
        gradient: {
            type: "vertical",
        }
    },
    stroke: {
        show: true,
        curve: "straight",
        lineCap: "round",
        width: 2
    },
    xaxis: {
        labels: {
            style: {
                colors: "#ffffff",
                fontSize: "12px",
            }
        }
    },
    yaxis: {
        title: {
            text: "MAGNITUDE",
            style: {
                color: "var(--primary)",
                fontSize: "14px",
            }
        },
        labels: {
            style: {
                colors: "#ffffff",
                fontSize: "12px"
            }
        }
    },
    tooltip: {
        theme: "dark",
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                    return locations[dataPointIndex] + "<br /><b>Magnitude: <b/>";
                }
            }
        }
    },
    noData: {
        text: "Loading..."
    }
}

var dailyOptions = {
    chart: {
        toolbar: {
            show: false
        },
        type: "bar",
        height: '300'
    },
    fill: {
        colors: "rgb(255, 150, 0)",
        gradient: {
            type: "vertical",
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: "14px",
            fontWeight: "bold"
        }
    },
    series: [],
    xaxis: {
        labels: {
            style: {
                colors: "#ffffff",
                fontSize: "12px",
            }
        }
    },
    yaxis: {
        title: {
            text: "TOTAL QUAKES",
            style: {
                color: "var(--primary)",
                fontSize: "14px",
            }
        },
        labels: {
            style: {
                colors: "#ffffff",
                fontSize: "12px"
            }
        }
    },
    tooltip: {
        theme: "dark"
    },
    noData: {
        text: "Loading..."
    }
}


var magDonutOptions = {
    chart: {
        type: "donut"
    },
    series: [],
    labels: ["small: < 2.0", "mild: 2 - 5", "moderate: 5 - 8", "severe: > 8"],
    colors: ["rgb(0, 255, 50)", "rgb(0,100,255)", "rgb(128, 0, 128)", "rgb(255, 0, 0"],
    dataLabels: {
    },
}

if(document.getElementById("hourlyPlot") && document.getElementById("dailyPlot")){
    var hourlyChart = new ApexCharts(document.getElementById("hourlyPlot"), hourlyOptions);
    hourlyChart.render();

    var quakeCountChart = new ApexCharts(document.getElementById("dailyPlot"), dailyOptions);
    quakeCountChart.render();

    hourlyChartUpdate();
    quakesPerDayUpdate();
    var chartInterval = setInterval(function(){hourlyChartUpdate();quakesPerDayUpdate();}, 60000);
}

if(document.getElementById("magDonut")){
    var magDonut = new ApexCharts(document.getElementById("magDonut"), magDonutOptions);
    magDonut.render();

    donutUpdate();
}