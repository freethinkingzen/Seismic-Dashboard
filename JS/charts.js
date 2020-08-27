
var hourlyQuakes = [];
var dailyQuakeData = [];
var locations = [];

function magnitudeChartUpdate(){
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

function quakesPerUpdate(){
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
function magDonutUpdate(){
    small = 0;
    mild = 0;
    moderate = 0;
    severe = 0;
    apiInfo(url_month)
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
        },
    },
    yaxis: {
        title: {
            text: "MAGNITUDE",
            style: {
                color: "rgb(0, 180, 255)",
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
        height: '250'
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
                color: "rgb(0, 180, 255)",
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
        type: "donut",
        foreColor: "#ffffff",
        width: 350
    },
    stroke: {
        width: 1,
        colors: "var(--dark)"
    },
    series: [],
    labels: [" Less Than 2.0", " 2.0 to 4.9", " 5.0 to 7.9", " Greater Than 8.0"],
    colors: ["rgb(0, 255, 50)", "rgb(0,100,255)", "rgb(250, 0, 250)", "rgb(255, 0, 0)"],
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    name: {
                        show: true,
                        color: "#ffffff"
                    },
                    value: {
                        show: true,
                        color: "#ffffff"
                    },
                    total: {
                        show: true,
                        color: "#ffffff"
                    }
                },
            }
        }
    },
    tooltip: {
        enabled: false
    }
}

if(document.getElementById("magnitudesPlot") && document.getElementById("quakesPerPlot")){
    var hourlyChart = new ApexCharts(document.getElementById("magnitudesPlot"), hourlyOptions);
    hourlyChart.render();

    var quakeCountChart = new ApexCharts(document.getElementById("quakesPerPlot"), dailyOptions);
    quakeCountChart.render();

    magnitudeChartUpdate();
    quakesPerUpdate();
    var chartInterval = setInterval(function(){magnitudeChartUpdate();quakesPerUpdate();}, 60000);
}

if(document.getElementById("magDonut")){
    var magDonut = new ApexCharts(document.getElementById("magDonut"), magDonutOptions);
    magDonut.render();

    magDonutUpdate();
}