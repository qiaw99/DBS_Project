#!/bin/bash

#using sudo so often as otherwise
#for every su there will be a pwd
#prompt

echo "create user for database"
sudo adduser dbsteam
echo "create new database"
sudo su - postgres -c "psql -U postgres -c 'CREATE DATABASE dbsteam;'"
echo "create new user"
sudo su - postgres -c "psql -U postgres -c \"CREATE USER dbsteam WITH ENCRYPTED PASSWORD 'dbsteam2020';\""
echo "grant all privileges"
sudo su - postgres -c "psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE dbsteam TO dbsteam;\""
echo "copy file to users home"
sudo cp ./dbsProjekt_20200621.pgsql /home/dbsteam/dbsProjekt_2020621.pgsql
echo "import database dump"
sudo su - dbsteam -c "psql -U dbsteam -d dbsteam < /home/dbsteam/dbsProjekt_2020621.pgsql"
