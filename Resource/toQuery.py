#Das Skript habe ich genutzt um die Queries für das Hinzufügen der EU Daten für meine Datenbank zu nutzen
#Es baut aus den JSON Dateien einen UpdateString für die bei mir schon bestehenden Einträge - das fällt bei
#dir wahrscheinlich weg

import json
import urllib.request

data = json.load(open('EU_Dataset.json'))['records']


lastCountry = ""
#Das fällt bei dir weg, wenn du nur EU Daten importieren willst
oldCountries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua_and_Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Saint Eustatius and Saba", "Bosnia_and_Herzegovina", "Botswana", "Brazil", "British_Virgin_Islands", "Brunei_Darussalam", "Bulgaria", "Burkina_Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape_Verde", "Cases_on_an_international_conveyance_Japan", "Cayman_Islands", "Central_African_Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa_Rica", "Cote_dIvoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Democratic_Republic_of_the_Congo", "Denmark", "Djibouti", "Dominica", "Dominican_Republic", "Ecuador", "Egypt", "El_Salvador", "Equatorial_Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland_Islands_(Malvinas)", "Faroe_Islands", "Fiji", "Finland", "France", "French_Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea_Bissau", "Guyana", "Haiti", "Holy_See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle_of_Man", "Israel","Italy"]

#So sehen bei mir die Tables aus. Die Table namen (coutnry/record) musst du durch deine ersetzen,
#Die namen in den Klammern sind die Columns bei mir - pop2018 fällt bei dir bspw weg wenn du nur
#EU Daten nimmst

insertCountry = "INSERT INTO country(id, population2018, name, continent, population2019) VALUES"
insertRecord = "INSERT INTO record (id, countryID, recordDate, deaths, cases) VALUES"
updateCountry = ""
for json_object in data:
    # Das braucht man, damit das Land nur einmal eingefügt wird, da jedes JSON Objekt das Land nochmal hat
    if lastCountry != json_object['countriesAndTerritories']:
        # Der Branch fällt wohl weg, das ist nur damit ich nich tnochmal die bereits bestehenden Länder einfüge,
        # wenn du nur EU in eine neue DB einfügst brauchst du das nicht
        if json_object['countriesAndTerritories'] in oldCountries:
            popdata = json_object.get('popData2019', '0')
            if not popdata:
                popdata = '0'
            updateCountry += "UPDATE country SET population2019 = " + str(popdata) + " WHERE name='" + json_object['countriesAndTerritories'] + "';\n"
        #hier wird der String für ein neues Land erstellt 
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

#Hier wird die finale sql Datei erstellt
#psql -d DATENBANK -U NUTZER -f DATEINAME
with open("covid19_EUqueries.sql", "a") as query:
    query.write(updateCountry + insertCountry + insertRecord)
