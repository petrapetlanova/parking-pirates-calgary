#!/bin/bash

# Store the script's own PID
SCRIPT_PID=$$

# Function to send Ctrl-C
send_ctrl_c() {
    # Find the Node process PID
    NODE_PID=$(pgrep -f "node updateStreetPricing.js")
    if [ ! -z "$NODE_PID" ]; then
        kill -2 $NODE_PID
    fi
    # Kill the script itself
    kill -2 $SCRIPT_PID
}

echo "Command 4/5: Press Enter to run: node updateStreetPricing.js"
read

# Run the node process
node updateStreetPricing.js &
NODE_PID=$!

# Wait for a moment to ensure the process is running
sleep 1

# Send Ctrl-C
send_ctrl_c