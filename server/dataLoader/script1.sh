#!/bin/bash

echo "Command 1/5: Press Enter to run: node parkingLotLoader.js"
read

node parkingLotLoader.js
if [ $? -ne 0 ]; then
    echo "Error executing parkingLotLoader.js"
    exit 1
fi
echo "Command 1/5 completed successfully!"
exit 0