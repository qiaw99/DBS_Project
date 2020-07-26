import json
import urllib.request

#data = 0
#with urllib.request.urlopen('https://opendata.ecdc.europa.eu/covid19/casedistribution/json') as url:
#    data = json.loads(url.read().decode())
#    with open('euData.json', 'w') as out:
#        json.dump(data, out)
data = json.load(open('EU_Dataset.json'))['records']


lastCountry = ""
oldCountries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua_and_Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Saint Eustatius and Saba", "Bosnia_and_Herzegovina", "Botswana", "Brazil", "British_Virgin_Islands", "Brunei_Darussalam", "Bulgaria", "Burkina_Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape_Verde", "Cases_on_an_international_conveyance_Japan", "Cayman_Islands", "Central_African_Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa_Rica", "Cote_dIvoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic_Republic_of_the_Congo", "Denmark", "Djibouti", "Dominica", "Dominican_Republic", "Ecuador", "Egypt", "El_Salvador", "Equatorial_Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland_Islands_(Malvinas)", "Faroe_Islands", "Fiji", "Finland", "France", "French_Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea_Bissau", "Guyana", "Haiti", "Holy_See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle_of_Man", "Israel","Italy"]

insertCountry = "INSERT INTO country(id, population2018, name, continent, population2019) VALUES"
insertRecord = "INSERT INTO record (id, countryID, recordDate, deaths, cases) VALUES"
updateCountry = ""
for json_object in data:
    #country insert
    if lastCountry != json_object['countriesAndTerritories']:
        if json_object['countriesAndTerritories'] in oldCountries:
            popdata = json_object.get('popData2019', '0')
            if not popdata:
                popdata = '0'
            updateCountry += "UPDATE country SET population2019 = " + str(popdata) + " WHERE name='" + json_object['countriesAndTerritories'] + "';\n"
        else:
            insertCountry += "(DEFAULT, 0, "
            insertCountry += "'" + json_object['countriesAndTerritories']  + "',"
            cont = "'" + json_object.get('continentExp', 'null') + "'"
            if cont == "''":
                cont = "null"
            insertCountry += cont + ","
            popdata = json_object.get('popData2019', '0')
            if not popdata:
                popdata = '0'
            insertCountry += str(popdata) + "),\n"
        lastCountry = json_object['countriesAndTerritories']
    #record insert
    insertRecord += "(DEFAULT, "
    #Query to get the right countryID
    insertRecord += "(SELECT ID FROM country WHERE name='" + json_object['countriesAndTerritories'] + "'),"
    insertRecord += "'" + json_object['dateRep'] + "',"
    cases = json_object.get('cases', '0')
    if not cases:
        cases = '0'
    insertRecord +=  str(cases) + ","
    deaths = json_object.get('deaths','0')
    if not deaths:
        deaths = '0'
    insertRecord +=  str(deaths) + "),\n"


insertCountry = insertCountry[:-2] + ";\n"
insertRecord = insertRecord[:-2] + ";\n"

with open("covid19_EUqueries.sql", "a") as query:
    query.write(updateCountry + insertCountry + insertRecord)
