#!/bin/bash

echo "Command 5/5: Press Enter to run: node mergeCollections.js"
read

node mergeCollections.js
if [ $? -ne 0 ]; then
    echo "Error executing mergeCollections.js"
    exit 1
fi
echo "Command 5/5 completed successfully!"
exit 0