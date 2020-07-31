/*      
 *      TODO:
 *      1. Add interval feature
 *      2. Add select country date and represent into table feature
 * 
 */

function clearTable() {
    var table = document.getElementById('table');
    var clearBtn = document.getElementById('clearBtn');
    var tableBody = document.getElementById('tableBody');
    table.style.visibility = 'hidden';
    clearBtn.style.visibility = 'hidden';
    tableBody.innerHTML = " ";
}

function makeTableVisible() {
    var table = document.getElementById('table');
    var clearBtn = document.getElementById('clearBtn');
    table.style.visibility = 'visible';
    clearBtn.style.visibility = 'visible';
}

function insertRow(record, countryName) {
    var table = document.getElementById("tableBody");
    var row = table.insertRow(0);
    var cName = row.insertCell(0);
    var date = row.insertCell(1);
    var cases = row.insertCell(2);
    var death = row.insertCell(3)
    cName.innerHTML = countryName;
    date.innerHTML = record['2'];
    cases.innerHTML = record['3'];
    death.innerHTML = record['4'];
}

$(document).ready(function () {   
        
    var dailyCases = {};
    var dailyDeath = {};
    var countries = {};
    var lines = [];
    function getKeyByValue(object, value) { 
        return Object.keys(object).find(key => object[key] === value); 
    } 

    $.ajax({
		url: "/assets/data/record_export.csv",
		dataType: "text",
		success: function(recordData) {
			prepareRecordData(recordData);
		}
    });
    
    $.ajax({
		url: "/assets/data/country_export.csv",
		dataType: "text",
		success: function(countryData) {
			prepareCountryData(countryData);
		}
    });
    
    function prepareCountryData(countryData) {
        let lineData = countryData.split(/\r?\n/);
        for (var count = 1; count < lineData.length; count++) {
            var cellData = lineData[count].split(",");
            var id = cellData[0];  
            /* if it is in unsortedDailyCases it should be in death_cases   */
            if (id in countries) {
                alert("Country ", id, " exists! Error.");
            }
            else {
                countries[id] = cellData[2].trim();
            }
        }

    }

    function prepareRecordData(recordData) {
        var unsortedDailyCases = {};
        var unsortedDailyDeath = {};
        var caseGraph = 'cases';
        var deathGraph = 'death';
        let lineData = recordData.split(/\r?\n/);
        
        /* begin with 1 to skip header */
        for (var count = 1; count < lineData.length; count++) {
            var cellData = lineData[count].split(",");
            let tarr = [];
            for (var j = 0; j < cellData.length; j++) {
                tarr.push(cellData[j]);
            }
            lines.push(tarr);
            var day = cellData[2];  // position of date in record_export.csv 
            /* if it is in unsortedDailyCases it should be in death_cases   */
            if (day in unsortedDailyCases) {
                unsortedDailyDeath[day] += parseInt(cellData[3]);   // position of daily death
                unsortedDailyCases[day] += parseInt(cellData[4]);     // position of daily cases. Sorry for magic numbers
            }
            else {
                unsortedDailyDeath[day] = parseInt(cellData[3]);   
                unsortedDailyCases[day] = parseInt(cellData[4]);
            }
    
        }

        /* sorting by data asc */
        Object.keys(unsortedDailyCases).sort().forEach((key) => {
            dailyCases[key] = unsortedDailyCases[key]
        });
        paintGraph(dailyCases, caseGraph);

        Object.keys(unsortedDailyDeath).sort().forEach((key) => {
            dailyDeath[key] = unsortedDailyDeath[key]
        });
        paintGraph(dailyDeath, deathGraph);
        updateOptions();
    }


    function paintGraph(dailyCases, id) {
        date = Object.keys(dailyCases);
        values = Object.values(dailyCases);
		let ctxL = document.getElementById(id).getContext('2d');
		let myLineChart = new Chart(ctxL, {
			type: 'line',
			data: {
				labels: date,
				datasets: [{
						label: id,
						data: values,
						backgroundColor: [
							'rgba(0, 0, 0, 0)',
						],
						borderColor: [
							'rgba(240, 52, 52, 1)',
						],
						borderWidth: 2
					},
				]
			},
			options: {
				responsive: true
            },
            plugins: {
                zoom: {
                    // Container for pan options
                    pan: {
                        // Boolean to enable panning
                        enabled: true,
            
                        // Panning directions. Remove the appropriate direction to disable
                        // Eg. 'y' would only allow panning in the y direction
                        // A function that is called as the user is panning and returns the
                        // available directions can also be used:
                        //   mode: function({ chart }) {
                        //     return 'xy';
                        //   },
                        mode: 'xy',
            
                        rangeMin: {
                            // Format of min pan range depends on scale type
                            x: null,
                            y: null
                        },
                        rangeMax: {
                            // Format of max pan range depends on scale type
                            x: null,
                            y: null
                        },
            
                        // On category scale, factor of pan velocity
                        speed: 20,
            
                        // Minimal pan distance required before actually applying pan
                        threshold: 10,
            
                        // Function called while the user is panning
                        onPan: function({chart}) { console.log(`I'm panning!!!`); },
                        // Function called once panning is completed
                        onPanComplete: function({chart}) { console.log(`I was panned!!!`); }
                    },
            
                    // Container for zoom options
                    zoom: {
                        // Boolean to enable zooming
                        enabled: true,
            
                        // Enable drag-to-zoom behavior
                        drag: true,
            
                        // Drag-to-zoom effect can be customized
                        // drag: {
                        // 	 borderColor: 'rgba(225,225,225,0.3)'
                        // 	 borderWidth: 5,
                        // 	 backgroundColor: 'rgb(225,225,225)',
                        // 	 animationDuration: 0
                        // },
            
                        // Zooming directions. Remove the appropriate direction to disable
                        // Eg. 'y' would only allow zooming in the y direction
                        // A function that is called as the user is zooming and returns the
                        // available directions can also be used:
                        //   mode: function({ chart }) {
                        //     return 'xy';
                        //   },
                        mode: 'xy',
            
                        rangeMin: {
                            // Format of min zoom range depends on scale type
                            x: null,
                            y: null
                        },
                        rangeMax: {
                            // Format of max zoom range depends on scale type
                            x: null,
                            y: null
                        },
            
                        // Speed of zoom via mouse wheel
                        // (percentage of zoom on a wheel event)
                        speed: 0.1,
            
                        // Minimal zoom distance required before actually applying zoom
                        threshold: 2,
            
                        // On category scale, minimal zoom level before actually applying zoom
                        sensitivity: 3,
            
                        // Function called while the user is zooming
                        onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
                        // Function called once zooming is completed
                        onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
                    }
                }
            }

		});
    }

    function updateOptions() {
        $.each(countries, function( key, value ) {
            $('#country')
                .append($("<option></option>")
                    .attr("value", value)
                    .text(value));
        });
        $.each(dailyCases, function( key, value ) {
            $('#day')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(key));
        });
    }

    $("#queryForm").submit(function(e) {
        e.preventDefault();
        handleRequest();
    });
    
    function handleRequest() {
        var countryName, date;
        countryName = document.getElementById("country").value;
        if (countryName === "") {
            alert("You did not pick a country! Error");
            return 0;
        }
        else {
            date = document.getElementById("day").value;
            if (date === "") {
                alert("You did not pick a date! Error");
                return 0;
            }
        }
        var countryId = getKeyByValue(countries, countryName);
        var record;
        record = lines.find(element => (element[1] === countryId && element[2] === date));
        if (record === undefined) {
            alert("Requested record is not in database. Sorry!");
        }
        else {
            makeTableVisible();
            insertRow(record, countryName);
        }
    }
    
});

