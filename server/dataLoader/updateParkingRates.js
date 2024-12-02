import { connectDb, disconnectDb, ParkingRate } from "../db.js";

async function updateParkingRates() {
  let connection = null;
  try {
    console.log("Connecting to database...");
    connection = await connectDb();

    const parkingRates = await ParkingRate.find().lean();
    console.log(`Found ${parkingRates.length} parking rate documents`);

    let updatedCount = 0;
    let skippedCount = 0;
    const skippedList = [];
    const completedList = [];

    for (const doc of parkingRates) {
      try {
        if (!doc.parkingRates || !doc.parkingRates[0]) {
          skippedList.push({
            globalid: doc.globalid,
            reason: "No parkingRates array or empty",
          });
          skippedCount++;
          continue;
        }

        const rateInfo = doc.parkingRates[0];
       
        let dailyPrice = null;

        // Check max field first
        if (rateInfo.max && typeof rateInfo.max === "string") {
          const maxMatch = rateInfo.max.match(/\$(\d+(\.\d{1,2})?)/);
          if (maxMatch) {
            dailyPrice = maxMatch[0];

            const result = await ParkingRate.updateOne(
              { globalid: doc.globalid },
              { $set: { dailyRate: dailyPrice } }
          );
          
          console.log("Update Result:", result);

            completedList.push({
              globalid: doc.globalid,
              title: doc.title,
              url: doc.url,
              parkingRates: [rateInfo],
              dailyRate: dailyPrice,
            });
            updatedCount++;
            continue;
          }
        }

        // Check rate field for "max"
        if (!dailyPrice && rateInfo.rate) {
          const rateLower = rateInfo.rate.toLowerCase();
          if (rateLower.includes("max")) {
            const rateMatch = rateInfo.rate.match(/\$(\d+(\.\d{1,2})?)/);
            if (rateMatch) {
              dailyPrice = rateMatch[0];

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        // Check hours field for "flat"
        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("flat")) {
            const rateMatch = rateInfo.hours.match(/\$(\d+(\.\d{1,2})?)/);
            if (rateMatch) {
              dailyPrice = rateMatch[0];

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        // Check period fields for monthly then removed
        if (!dailyPrice && rateInfo.period) {
          const periodLower = rateInfo.period.toLowerCase();
          if (periodLower.includes("monthly")) {
            skippedList.push({
              globalid: doc.globalid,
              reason: "Monthly rate",
            });
            skippedCount++;
            continue;
          }
        }
        // looking for 24 hours
        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("24 hours")) {
            const priceMatch = hoursLower.match(/\$(\d+(\.\d{1,2})?)/);
            if (priceMatch) {
              dailyPrice = priceMatch[0];

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        // Looking for daily
        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("daily")) {
            const priceMatch = hoursLower.match(/\$(\d+(\.\d{1,2})?)/);
            if (priceMatch) {
              dailyPrice = priceMatch[0];

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("per 1/2 hour")) {
            const priceMatch = hoursLower.match(/\$(\d+(\.\d{1,2})?)/);
            if (priceMatch) {
              dailyPrice = `$${(priceMatch * 16).toFixed(2)}`;

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("per hour")) {
            const priceMatch = hoursLower.match(/\$(\d+(\.\d{1,2})?)/);
            if (priceMatch) {
              const basePrice = parseFloat(priceMatch[1]);
              dailyPrice = `$${(basePrice * 8).toFixed(2)}`;

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        if (!dailyPrice && rateInfo.hours) {
          const hoursLower = rateInfo.hours.toLowerCase();
          if (hoursLower.includes("per 2 hour")) {
            const priceMatch = hoursLower.match(/\$(\d+(\.\d{1,2})?)/);
            if (priceMatch) {
              dailyPrice = `$${(priceMatch * 4).toFixed(2)}`;

              await ParkingRate.updateOne(
                { globalid: doc.globalid },
                { $set: { dailyRate: dailyPrice } }
              );

              completedList.push({
                globalid: doc.globalid,
                title: doc.title,
                url: doc.url,
                parkingRates: [rateInfo],
                dailyRate: dailyPrice,
              });
              updatedCount++;
              continue;
            }
          }
        }

        // Update document if we found a daily price
        if (dailyPrice) {
          await ParkingRate.updateOne(
            { globalid: doc.globalid },
            { $set: { dailyRate: dailyPrice } }
          );

          completedList.push({
            globalid: doc.globalid,
            title: doc.title,
            url: doc.url,
            parkingRates: [rateInfo],
            dailyRate: dailyPrice,
          });
          updatedCount++;
        } else {
          skippedList.push({
            globalid: doc.globalid,
            reason: "No valid price found in any field",
          });
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error processing document ${doc.globalid}:`, error);
        skippedList.push({
          globalid: doc.globalid,
          reason: "Processing error",
          error: error.message,
        });
        skippedCount++;
      }
    }

    return {
      success: true,
      processed: parkingRates.length,
      updated: updatedCount,
      skipped: skippedCount,
      completedList,
      skippedList,
    };
  } catch (error) {
    console.error("Error updating parking rates:", error);
    throw error;
  } finally {
    if (connection) {
      console.log("Disconnecting from database...");
      await disconnectDb();
    }
  }
}
updateParkingRates().then(() => {
  console.log('All parking rates updated successfully.');
  return;
}).catch((err) => {
  console.error('Error occurred during update:', err);
});

export { updateParkingRates };
