import { StreetParking, connectDb, disconnectDb } from "../db.js";

async function fetchAndStoreStreetParking() {
  // Connect to MongoDB
  await connectDb();

  const baseUrl = "https://data.calgary.ca/resource/rhkg-vwwp.json";
  const limit = 5000;
  let offset = 0;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      // Fetch the data with limit and offset for pagination
      const response = await fetch(`${baseUrl}?$limit=${limit}&$offset=${offset}`);
      if (response.status !== 200) {
        throw new Error("Request to data.calgary.ca failed");
      }

      const cityParkingSpots = await response.json();
      console.log(`Fetched ${cityParkingSpots.length} records with offset ${offset}`);

      // Prepare bulk operations array for MongoDB
      const bulkOps = [];

      // Map the data to match the schema
      cityParkingSpots.forEach((item) => {
        if (item.stall_type === undefined) {
          console.log("Missing stall_type in item:", item);
        }

        const coordinates = item.line?.coordinates || [];
        
        const parkingSpot = {
          parkingZone: item.parking_zone || null,
          zoneType: item.zone_type || null,
          stallType: item.stall_type || null,
          address: item.address_desc || null,
          blockSide: item.block_side || null,
          permitZone: item.permit_zone || null,
          status: item.status || null,
          priceZone: item.price_zone || null,
          enforceableTime: item.enforceable_time || null,
          maxTime: item.max_time || null,
          parkingRestrictType: item.parking_restrict_type || null,
          parkingRestrictTime: item.parking_restrict_time || null,
          location: {
            type: "MultiLineString",
            coordinates: coordinates.length > 0 ? coordinates : [],
          },
          neighborhood: item.brz_name || null,
        };

        // Prepare bulk insert operation
        bulkOps.push({
          updateOne: {
            filter: {
              parkingZone: parkingSpot.parkingZone,
              zoneType: parkingSpot.zoneType,
              address: parkingSpot.address,
              blockSide: parkingSpot.blockSide,
              permitZone: parkingSpot.permitZone,
              coordinates: parkingSpot.location.coordinates,
              priceZone: parkingSpot.priceZone,
              neighborhood: parkingSpot.neighborhood,
            },
            update: { $setOnInsert: parkingSpot },
            upsert: true, // If not found, insert a new record
          },
        });
      });

      // Execute bulk write if there are operations
      if (bulkOps.length > 0) {
        const result = await StreetParking.bulkWrite(bulkOps);
        console.log(`Bulk insert completed with ${result.upsertedCount} new records.`);
      }

      // Update offset and determine if there’s more data
      offset += limit;
      hasMoreData = cityParkingSpots.length === limit; // Stop if less than limit
    }
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  } finally {
    await disconnectDb();
  }
}

// Run the function
fetchAndStoreStreetParking().catch(console.error);