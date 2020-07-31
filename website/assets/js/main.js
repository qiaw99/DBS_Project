/*      
 *      TODO:
 *      1. Add interval feature
 *      2. Add select country date and represent into table feature
 * 
 */

$(document).ready(function () {     
    
    let dailyCases = {};
    let dailyDeath = {};
    $.ajax({
		url: "/assets/data/record_export.csv",
		dataType: "text",
		success: function(recordData) {
			prepare_data(recordData);
		}
	});

    function prepare_data(recordData) {
        let unsortedDailyCases = {};
        let unsortedDailyDeath = {};
        var caseGraph = 'cases';
        var deathGraph = 'death';
        var line_data = recordData.split(/\r?\n/);
        /* begin with 1 to skip header */
        for (var count = 1; count < line_data.length; count++) {
            var cellData = line_data[count].split(",");
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
    }

    function paintGraph(dailyCases, id) {
        date = Object.keys(dailyCases);
        values = Object.values(dailyCases);
		var ctxL = document.getElementById(id).getContext('2d');
		var myLineChart = new Chart(ctxL, {
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
});

