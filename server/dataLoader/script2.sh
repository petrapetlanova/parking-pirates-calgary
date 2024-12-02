#!/bin/bash

echo "Command 2/5: Press Enter to run: node getStreetParkingfromCityJson.js"
read

node getStreetParkingfromCityJson.js
if [ $? -ne 0 ]; then
    echo "Error executing getStreetParkingfromCityJson.js"
    exit 1
fi
echo "Command 2/5 completed successfully!"
exit 0