import axios from 'axios';
import http from 'http';
import https from 'https';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import {ParkingRate} from '../db.js'
import dotenv from 'dotenv';




dotenv.config();
const mongo_uri = process.env.MONGO_URI; // MongoDB URI for local database


async function connectDb() {
    try {
        await mongoose.connect(mongo_uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error.message);
        throw error;
    }
}
// Function to fetch HTML from a URL
function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        client
            .get(url, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(data);
                });
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

// Function to clean data text
function cleanData(text) {
    return text.trim().replace(/\n/g, '').replace(/\s+/g, ' ');
}

// Function to fetch data from the API and process each link
const fetchData = async (url) => {
    try {
        // Connect to the database
        await connectDb();

        const response = await axios.get(url);
        const data = response.data;

        // Map over the results and parse each link's HTML
        for (const link of data) {
            if (!link.globalid || !link.home_page?.url) {
                console.warn(`Skipping entry with missing globalid or URL: ${JSON.stringify(link)}`);
                continue; // Skip entries without a globalid or valid URL
            }

            // Initialize parkingRates with parkingRates as an array
            const parkingRates = {
                title: link.address_desc,
                url: link.home_page.url,
                parkingRates: []
            };

            try {
                // Fetch HTML for the link and parse it
                const html = await fetchHtml(link.home_page.url);
                const $ = cheerio.load(html);

                // Extract parking rate information
                $('table.cui.striped.normal-view tbody tr').each((i, el) => {
                    const period = cleanData($(el).find('td').eq(0).text());
                    const hours = cleanData($(el).find('td').eq(1).text());
                    const rate = cleanData($(el).find('td').eq(2).text());
                    const max = cleanData($(el).find('td').eq(3).text());

                    // Push each row as an object to parkingRates array
                    parkingRates.parkingRates.push({ period, hours, rate, max });
                });

                // Extract coordinates and create GeoJSON
                const geoCoordinates = {
                    type: 'MultiPolygon', 
                    coordinates: link.multipolygon.coordinates, // Use multipolygon coordinates
                };

                // Now, store the parking rates and coordinates in MongoDB
                const parkingRate = new ParkingRate({
                    stall_type: link.stall_type ,
                    globalid: link.globalid,
                    title: link.address_desc,
                    url: link.home_page.url,
                    parkingRates: parkingRates.parkingRates,
                    coordinates: geoCoordinates,  // Store the GeoJSON coordinates
                });

                // Save to MongoDB
                await parkingRate.save();
                console.log(`Parking rates for ${link.address_desc} saved to DB`);

            } catch (err) {
                console.error(`Error fetching HTML from ${link.home_page.url}:`, err.message);
            }
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

// Replace with your API endpoint
const apiUrl = 'https://data.calgary.ca/resource/ggxk-g2u3.json';
fetchData(apiUrl).then(() => {
    console.log('Data fetched and posted successfully');
    process.exit(0); // Ensure process exits after everything completes
}).catch((err) => {
    console.error('Error during data fetch:', err);
    process.exit(1); // Exit with error code if something fails
});
