#!/bin/bash

echo "Command 3/5: Press Enter to run: node updateParkingRates.js"
read

node updateParkingRates.js &
PID=$!

if [ $? -ne 0 ]; then
    echo "Error executing updateParkingRates.js"
    kill -2 $PID
    exit 1
fi

echo "Command 3/5 completed successfully!"
kill -2 $PID
exit 0