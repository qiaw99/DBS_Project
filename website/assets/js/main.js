$(document).ready(function () { 
    let daily_cases = {};
    let daily_deathes = {};
    $.ajax({
		url: "/assets/data/record_export.csv",
		dataType: "text",
		success: function(data) {
			prepare_data(data);
		}
	});

    function prepare_data(data) {
        var line_data = data.split(/\r?\n/);
        /* begin with 1 to avoid header */
        for (var count = 1; count < line_data.length; count++) {
            var cell_data = line_data[count].split(",");
            var day = cell_data[2];  // position of date in record_export.csv 

            /* if it is in daily_cases it should be in death_cases   */
            if (day in daily_cases) {
                daily_cases[day] += parseInt(cell_data[3]); // position of daily cases 
                daily_deathes[day] += parseInt(cell_data[4]); // position of daily deathes. Sorry for magic numbers
            }
            else {
                daily_cases[day] = parseInt(cell_data[4]); // position of daily cases 
                daily_deathes[day] = parseInt(cell_data[3]); // position of daily deathes. Sorry for magic numbers    
            }
        }
        console.log(daily_cases["2020-06-14"]);
    }
});

