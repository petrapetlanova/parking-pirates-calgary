import { connectDb, disconnectDb, ParkingRate, UnifiedParking, StreetParking } from "../db.js";

async function mergeCollections() {
  try {
    await connectDb();

    // Fetch data from ParkingRate and StreetParking
    const parkingRates = await ParkingRate.find().lean();

    let streetParking = [];

    try {
      streetParking = await StreetParking.find().lean();
      if (!streetParking.length) {
        console.warn("Warning: StreetParking collection is empty.");
      }
    } catch (error) {
      console.warn("Warning: StreetParking collection does not exist or could not be retrieved.");
    }

    // Unified collection
    const mergedData = [];

    // Add data from ParkingRate
    for (const rate of parkingRates) {
      mergedData.push({
        globalid: rate.globalid || null,
        parkingZone: rate.parkingZone || "Parking lot",
        title: rate.title || null,
        url: rate.url || null,
        parkingRates: rate.parkingRates ? rate.parkingRates.map((rateItem) => ({
          period: rateItem.period || null,
          hours: rateItem.hours || null,
          rate: rateItem.rate || null,
          max: rateItem.max || null,
        })) : [],
        address: rate.title || null,
        blockSide: rate.blockSide || null,
        zoneType: rate.zoneType || "Parking lot",
        stallType: rate.stall_type || null,
        permitZone: rate.permitZone || "N/A",
        status: rate.status || "Active",
        priceZone: rate.priceZone || "N/A",
        dailyRate: rate.dailyRate || "Check parking rates",
        enforceableTime: rate.enforceableTime || "Check parking rates",
        maxTime: rate.maxTime || "Check parking rates",
        parkingRestrictType: rate.parkingRestrictType || null,
        parkingRestrictTime: rate.parkingRestrictTime || null,
        noStopping: rate.noStopping || null,
        neighborhood: rate.neighborhood || null,
        timestamp: rate.timestamp || new Date(),
        source: "ParkingRate",
        coordinates: {
          type: rate.coordinates?.type || 'MultiPolygon',
          coordinates: Array.isArray(rate.coordinates?.coordinates) 
            ? rate.coordinates.coordinates 
            : [],
        }
      });
    }

    // Add data from StreetParking
    for (const street of streetParking) {
      // let location = street.location || null;
      // if (location && !Array.isArray(location.coordinates)) {
      //   location = null;
      //   console.warn(`Invalid location for permitZone "${street.permitZone}". Skipping.`);
      // }
    

      mergedData.push({
        globalid: street._id,
        parkingZone: street.parkingZone,
        title: street.address,
        url: null,
        parkingRates: [],
        address: street.address || null,
        blockSide: street.blockSide || null,
        zoneType: street.zoneType || null,
        stallType: street.stallType || null,
        permitZone: street.permitZone || null,
        status: street.status || null,
        priceZone: street.priceZone || null,
        dailyRate: street.dailyRate || "Free",
        enforceableTime: street.enforceableTime || null,
        maxTime: street.maxTime || null,
        parkingRestrictType: street.parkingRestrictType || null,
        parkingRestrictTime: street.parkingRestrictTime || null,
        noStopping: street.noStopping || null,
        neighborhood: street.neighborhood || null,
        timestamp: new Date(),
        source: "StreetParking",
        coordinates: {
          type: 'MultiLineString',
          coordinates: Array.isArray(street.coordinates) 
            ? street.coordinates 
            : [],
        }
      });
    }

    // Insert merged data into UnifiedParking collection
    const insertedRecords = await UnifiedParking.insertMany(mergedData);
    console.log(`${insertedRecords.length} records successfully inserted into UnifiedParking collection.`);
  } catch (error) {
    console.error("Error during merging collections:", error);
  } finally {
    await disconnectDb();
  }
}

mergeCollections();
