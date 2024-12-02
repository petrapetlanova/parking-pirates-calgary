#!/bin/bash

# Make sure all scripts are executable
chmod +x script*.sh

echo "Running all scripts in sequence..."

echo -e "\nRunning script1.sh..."
./script1.sh

echo -e "\nRunning script2.sh..."
./script2.sh

echo -e "\nRunning script3.sh..."
./script3.sh

echo -e "\nRunning script4.sh..."
./script4.sh

echo -e "\nRunning script5.sh..."
./script5.sh

echo -e "\nAll scripts have been executed!"