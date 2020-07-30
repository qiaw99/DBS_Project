/*      
 *      TODO:
 *      1. Add interval feature
 *      2. Add select country date and represent into table feature
 * 
 */

function makeCasesSorted (rowData) {
    let result = {};
    Object.keys(rowData).sort().forEach((key) => {
        result[key] = rowData[key]
    });
    return result;
}


$(document).ready(function () {     
    
    let dailyCases = {};
    let dailyDeathes = {};
    $.ajax({
		url: "/assets/data/record_export.csv",
		dataType: "text",
		success: function(recordData) {
			prepare_data(recordData);
		}
	});

    function prepare_data(recordData) {
        let unsortedDailyCases = {};
        let unsortedDailyDeathes = {};
        var line_data = recordData.split(/\r?\n/);
        /* begin with 1 to skip header */
        for (var count = 1; count < line_data.length; count++) {
            var cell_data = line_data[count].split(",");
            var day = cell_data[2];  // position of date in record_export.csv 
            /* if it is in unsortedDailyCases it should be in death_cases   */
            if (day in unsortedDailyCases) {
                dailyDeathes[day] += parseInt(cell_data[3]);   // position of daily deathes
                unsortedDailyCases[day] += parseInt(cell_data[4]);     // position of daily cases. Sorry for magic numbers
            }
            else {
                dailyDeathes[day] = parseInt(cell_data[3]);   
                unsortedDailyCases[day] = parseInt(cell_data[4]);
            }

        }

        let dailyCases = makeCasesSorted(unsortedDailyCases);
        paint_cases_graph(dailyCases);
    }

    function paint_cases_graph(dailyCases) {
        date = Object.keys(dailyCases);
        values = Object.values(dailyCases);
		var ctxL = document.getElementById("lineChart").getContext('2d');
		var myLineChart = new Chart(ctxL, {
			type: 'line',
			data: {
				labels: date,
				datasets: [{
						label: "Deep",
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

