
var hourlyQuakes = [];
var quakeDepths = [];
var dailyQuakeData = [];
var locations = [];

function magnitudeChartUpdate(){
    hourlyQuakes = [];
    apiInfo(url_hour)
    .then(data => {
        for(feature of data.features){
            hourlyQuakes.push({x: parseTime(feature.properties.time), y: feature.properties.mag.toFixed(2)})
            quakeDepths.push({x: parseTime(feature.properties.time), y: feature.geometry.coordinates[2]})
            locations.push(feature.properties.place);
        }
        if(document.getElementById("magnitudesPlot")){
            magArea.updateSeries([{
                name: "Magnitude",
                data: hourlyQuakes.reverse(),
            }])
        }
        if(document.getElementById("depthsPlot")){
            depthArea.updateSeries([{
                name: "Depth",
                data: quakeDepths.reverse(),
            }])
        }
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

var small, mild, moderate, severe;
var shallow, medium, deep;
function donutUpdate(){
    small = mild = moderate = severe = 0;
    shallow = medium = deep = 0;

    apiInfo(url_month)
    .then(data => {
        for(feature of data.features){
            magnitude = feature.properties.mag;
            depth = feature.geometry.coordinates[2];
            if(magnitude <= 2){
                ++small;
            }
            else if(magnitude > 2 && magnitude < 5){
                ++mild;
            }
            else if(magnitude >=5 && magnitude < 8){
                ++moderate;
            }
            else if(magnitude >=8){
                ++severe;
            }

            if(depth < 70){
                ++shallow;
            }
            else if(depth >= 70 && depth < 300){
                ++medium;
            }
            else if(depth >= 300){
                ++deep;
            }
        }
        if(document.getElementById("magDonut")){
            magDonut.updateSeries([small, mild, moderate, severe]);
        }
        if(document.getElementById("depthDonut")){
            depthDonut.updateSeries([shallow, medium, deep]);
        }
    })
    .catch(reason => console.log(reason.mesage));
}

var magAreaOptions = {
    chart: {
        id: 'magnitudes',
        group: 'magDepth',
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
            },
            minWidth: 1,
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

var depthAreaOptions = {
    chart: {
        id: 'depths',
        group: 'magDepth',
        forecolor: '#ffffff',
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
        colors: "rgb(0, 0, 255)",
        gradient: {
            type: "vertical",
        }
    },
    stroke: {
        show: true,
        colors: ["rgb(255, 120, 0)"],
        curve: "straight",
        width: 2,
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
            text: "DEPTH",
            style: {
                color: "rgb(0, 180, 255)",
                fontSize: "14px",
            }
        },
        labels: {
            style: {
                colors: "#ffffff",
                fontSize: "12px"
            },
            minWidth: 1,
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
                    return "<br /><b>Depth in km: <b/>";
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
        forecolor: '#ffffff',
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
            },
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

var depthDonutOptions = {
    chart: {
        type: "donut",
        foreColor: "#ffffff",
        width: 370
    },
    stroke: {
        width: 1,
        colors: "var(--dark)"
    },
    series: [],
    labels: [" Less Than 70km", " 70km t0 300km", " Greater Than 300km"],
    colors: ["rgb(0, 255, 255)", "rgb(0, 0, 255)", "rgb(250, 0, 250)", "rgb(255, 0, 0)"],
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
    var magArea = new ApexCharts(document.getElementById("magnitudesPlot"), magAreaOptions);
    magArea.render();
}

if(document.getElementById("depthsPlot")){
    var depthArea = new ApexCharts(document.getElementById("depthsPlot"), depthAreaOptions);
    depthArea.render();
}

if(document.getElementById("quakesPerPlot")){
    var quakeCountChart = new ApexCharts(document.getElementById("quakesPerPlot"), dailyOptions);
    quakeCountChart.render();
    quakesPerUpdate();
}

if(document.getElementById("magDonut")){
    var magDonut = new ApexCharts(document.getElementById("magDonut"), magDonutOptions);
    magDonut.render();
}

if(document.getElementById("depthDonut")){
    var depthDonut = new ApexCharts(document.getElementById("depthDonut"), depthDonutOptions);
    depthDonut.render();
}

donutUpdate();
magnitudeChartUpdate();
var chartInterval = setInterval(function(){magnitudeChartUpdate();quakesPerUpdate();donutUpdate();}, 60000);