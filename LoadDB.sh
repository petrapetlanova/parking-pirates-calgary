#!/bin/bash

# Colors for status messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for completed scripts
completed=0
total=5

# Function to prompt for user input
wait_for_key() {
    echo -e "\n${YELLOW}Press any key to continue to the next command...${NC}"
    read -n 1 -s -r
    echo
}

# Function to check for various success messages
check_success() {
    local logfile=$1
    if [ ! -f "$logfile" ]; then
        return 1
    fi
    
    # Check for various success messages
    if grep -q "Data fetched and posted successfully" "$logfile" || \
       grep -q "Bulk insert completed" "$logfile" || \
       grep -q "Disconnected from MongoDB" "$logfile" || \
       grep -q "successfully" "$logfile"; then
        return 0
    fi
    return 1
}

# Function to wait for MongoDB connection message
wait_for_completion() {
    local logfile=$1
    local pid=$2
    local timeout=120  # 2 minutes timeout

    # Wait for either completion message or timeout
    local counter=0
    while [ $counter -lt $timeout ]; do
        if check_success "$logfile"; then
            return 0
        fi
        sleep 1
        counter=$((counter + 1))
        
        # Check if process is still running
        if ! kill -0 $pid 2>/dev/null; then
            if [ $counter -gt 5 ]; then  # If process ran for more than 5 seconds
                if check_success "$logfile"; then
                    return 0
                fi
            fi
            return 1
        fi
    done
    
    echo -e "${YELLOW}Timeout reached${NC}"
    return 1
}

# Function to run a command and wait for completion
run_command() {
    echo -e "\n${YELLOW}Starting: $1 ($completed/$total)${NC}"
    local logfile="./temp_${completed}.log"
    
    # Run the command and redirect output to both console and file
    $1 | tee "$logfile" &
    local pid=$!
    
    # Wait for completion
    if wait_for_completion "$logfile" $pid; then
        completed=$((completed + 1))
        echo -e "${GREEN}✓ Completed: $1 ($completed/$total)${NC}"
    else
        echo -e "${RED}✗ Failed or timed out: $1${NC}"
        echo -e "${YELLOW}Check the output above for any errors.${NC}"
    fi
    
    # Clean up
    rm -f "$logfile"
    
    echo "-----------------------------------"
    
    # Prompt for next command unless it's the last one
    if [ $completed -lt $total ]; then
        wait_for_key
    fi
}

# Print start banner
echo -e "${GREEN}=== Database Loading Script Started ===${NC}"

# Change to the dataLoader directory
echo "Changing to dataLoader directory..."
cd "$(dirname "$0")/server/dataLoader"

# Print current working directory for verification
echo "Current directory: $(pwd)"

# Array of commands to run sequentially
commands=(
    "node parkingLotLoader.js"
    "node getStreetParkingfromCityJson.js"
    "node updateParkingRates.js"
    "node updateStreetPricing.js"
    "node mergeCollections.js"
)

# Initial prompt
echo -e "${YELLOW}Press any key to start the database loading process...${NC}"
read -n 1 -s -r

# Run each command
for cmd in "${commands[@]}"; do
    run_command "$cmd"
done

# Final status report
echo -e "\n${GREEN}=== Final Status ===${NC}"
echo -e "Completed: ${completed}/${total} scripts"
if [ $completed -eq $total ]; then
    echo -e "${GREEN}All scripts completed successfully!${NC}"
else
    echo -e "${YELLOW}Some scripts may not have completed properly.${NC}"
fi

# Clean up any remaining temp files
rm -f temp_*.log

# Kill any remaining node processes
pkill node 2>/dev/null || true