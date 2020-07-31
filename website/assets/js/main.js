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
        Object.keys(unsortedDailyDeath).sort().forEach((key) => {
            dailyDeath[key] = unsortedDailyDeath[key]
        });

        paintGraph(dailyCases, caseGraph);
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
        $.each(dailyCases, function(key, value ) {
            $('#day')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(key));
        });

        $.each(dailyCases, function( key, value ) {
            $('#startDate')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(key));
        });
        $.each(dailyCases, function( key, value ) {
            $('#endDate')
                .append($("<option></option>")
                    .attr("value", key)
                    .text(key));
        });
    }

    $("#queryForm").submit(function(e) {
        e.preventDefault();
        updateTable();
    });
    
    $("#graphForm").submit(function(e) {
        e.preventDefault();
        drawGraphs();
    });

    function drawGraphs() {
        var startDate, endDate, dateList,startIndex, endIndex, newDateList, newDailyCases = {}, newDailyDeath = {};
        let newCaseGraph = 'intervalCases';
        let newDeathGraph = 'intervalDeath'
        startDate = document.getElementById("startDate").value;
        if (startDate === "") {
            alert("You did not pick a country! Error");
            return 0;
        }
        else {
            endDate = document.getElementById("endDate").value;
            if (endDate === "") {
                alert("You did not pick a country! Error");
                return 0;
            }
        }
        
        dateList = Object.keys(dailyCases); 
        startIndex = dateList.findIndex(element => element === startDate);
        endIndex = dateList.findIndex(element => element === endDate);
        newDateList = dateList.slice(startIndex, endIndex + 1);
        $.each(newDateList, function(index, value) {
            newDailyCases[value] = dailyCases[value];
            newDailyDeath[value] = dailyDeath[value];
        });
        paintGraph(newDailyCases, newCaseGraph);
        paintGraph(newDailyDeath, newDeathGraph);
    }

    function updateTable() {
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

