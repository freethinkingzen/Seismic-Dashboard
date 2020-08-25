
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
        hourlyChart.updateOptions([{

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
        title: {
            text: "TIME",
            style: {
                color: "var(--primary)",
                fontSize: "14px",
            }
        },
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

       /* custom: function({ series, seriesIndex, dataPointIndex, w }) {
            return (
                '<div class="arrow_box">' +
                "<span>" +
                "Magnitude " + series[seriesIndex][dataPointIndex]
                 +
                "<br />" +
                locations[dataPointIndex]
                 +
                "</span>" +
                "</div>"
            );
        }
        */
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
        title: {
            text: "DATE",
            style: {
                color: "var(--primary)",
                fontSize: "14px",
            }
        },
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
    noData: {
        text: "Loading..."
    }
}

var hourlyChart = new ApexCharts(document.getElementById("hourlyPlot"), hourlyOptions);
hourlyChart.render();

var quakeCountChart = new ApexCharts(document.getElementById("dailyPlot"), dailyOptions);
quakeCountChart.render();

hourlyChartUpdate();
quakesPerDayUpdate();
var chartInterval = setInterval(function(){hourlyChartUpdate();quakesPerDayUpdate();}, 60000);