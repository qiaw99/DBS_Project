import json

from datetime import datetime

import matplotlib.dates as mdates
import matplotlib.pyplot as plt

with open("covid19.json", 'r') as f:
    json_str = json.load(f)
    
record = {}

# get pure python data structure in form [{}, {}, ..., {}]
data = json_str["records"]

for dic in data: 
    if dic["countriesAndTerritories"] not in record:
        record[dic["countriesAndTerritories"]] = [[dic["dateRep"]], [[dic["cases"], dic["deaths"]]]]
    else:
        record[dic["countriesAndTerritories"]][0].append(dic["dateRep"])
        record[dic["countriesAndTerritories"]][1].append([dic["cases"], dic["deaths"]])
        
#print(record)
counter = 0
for key in record.keys():
    print(key)
    dates = record[key][0]

    #print(dates)
    xs = [datetime.strptime(d, '%d/%m/%Y').date() for d in dates]
    temp = record[key][1]
    ys = []
    for i in range(len(temp)):
        ys.append(int(temp[i][0]))
    #print(ys)

    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%d/%m/%Y'))
    plt.gca().xaxis.set_major_locator(mdates.DayLocator())
    # Plot
    plt.title("The report of " + key)
    plt.ylabel("Number of cases")
    plt.xlabel("Date")
    plt.plot(xs, ys)
    plt.gcf().autofmt_xdate()  
    plt.savefig("plot" + str(counter) + ".png")
    counter += 1
    plt.show()
