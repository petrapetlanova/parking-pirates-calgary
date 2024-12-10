Step 1 

cd client 
npm install

step 2 

cd ../
cd Server npm install

step 3 
Copy/Paste .env to dataLoader folder
cd server/dataLoader
./run.sh
node mergeCollections.js
