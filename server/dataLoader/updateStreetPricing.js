import { connectDb, disconnectDb, Zone, StreetParking } from "../db.js";
import { ObjectId } from "mongodb"; // Import ObjectId

async function updateStreetPricing() {
  let connection = null;
  try {
    console.log("Connecting to database...");
    connection = await connectDb();

    // Fetch all zones
    const zones = await Zone.find().lean();
    console.log(`Found ${zones.length} zones`);

    // Create a map of zone numbers to prices
    const zonePriceMap = new Map(
      zones.map((zone) => [zone.zone.toString(), zone.price])
    );

    // Fetch all street parking documents
    const streetParkingDocs = await StreetParking.find().lean();
    console.log(`Found ${streetParkingDocs.length} street parking locations`);

    // Initialize counters for statistics
    let updatedCount = 0;
    let skippedCount = 0;

    for (const doc of streetParkingDocs) {
      try {
        const priceZone = doc["priceZone"]; // Correct field access
        if (priceZone !== undefined && priceZone !== null) {
          const priceZoneString =
            typeof priceZone === "number" ? priceZone.toString() : priceZone;

          const matchingPrice = zonePriceMap.get(priceZoneString);

          if (matchingPrice) {
            await StreetParking.updateOne(
              { _id: new ObjectId(doc._id) },
              {
                $set: { dailyRate: matchingPrice },
                $unset: { priceZone: "" }, // Updated to match correct field
              }
            );
            console.log(
              `Successfully updated document ${doc._id} with price: ${matchingPrice}`
            );
            updatedCount++;
          } else {
            console.log(
              `No matching price found for priceZone: ${priceZoneString} in document ${doc._id}`
            );
            skippedCount++;
          }
        } else {
          console.log(`Document ${doc._id} has undefined or null priceZone`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error processing document ${doc._id}:`, error);
        skippedCount++;
      }
    }

    // Log update summary
    console.log("\nUpdate Summary:");
    console.log(`Total documents processed: ${streetParkingDocs.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);

    // Verify updates
    const updatedDoc = await StreetParking.findOne({
      dailyRate: { $exists: true },
    });

    if (updatedDoc) {
      console.log("\nSample updated document:");
      console.log(JSON.stringify(updatedDoc, null, 2));
    }

    return {
      success: true,
      processed: streetParkingDocs.length,
      updated: updatedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    console.error("Error updating street pricing:", error);
    throw error;
  } finally {
    if (connection) {
      console.log("Disconnecting from database...");
      await disconnectDb();
    }
  }
}

// Run the update function
updateStreetPricing().catch((err) => {
  console.error("Unhandled error:", err);
});

export { updateStreetPricing };
