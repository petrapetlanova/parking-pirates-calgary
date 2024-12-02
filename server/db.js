import mongoose from "mongoose";
import dotenv from 'dotenv';




dotenv.config();
const mongo_uri = process.env.MONGO_URI; // MongoDB URI for local database


// Parking Rate Schema
const parkingRateSchema = new mongoose.Schema({
  globalid: { type: String, required: true },
  stall_type: { type: String },
  title: { type: String, required: true },
  url: { type: String, required: true },
  parkingRates: [
    {
      period: String,
      hours: String,
      rate: String,
      max: String,
    },
  ],
  coordinates: {
    type: {
      type: String,
      enum: ["Point", "MultiLineString", "MultiPolygon"], // Allowing Point, MultiLineString, and MultiPolygon
      required: true,
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Allow different geospatial structures
      required: true,
    },
  },
  timestamp: { type: Date, default: Date.now },
  dailyRate: { type: String },
});

// Add geospatial index for ParkingRate coordinates
parkingRateSchema.index({ coordinates: "2dsphere" });

// Model definition for parking rates
export const ParkingRate = mongoose.model("ParkingRate", parkingRateSchema, "parkingrates");

// Street Parking Schema
const StreetParkingSchema = new mongoose.Schema({
  parkingZone: { type: String },
  zoneType: { type: String },
  stallType: { type: String },
  address: { type: String },
  blockSide: { type: String },
  permitZone: { type: String },
  status: { type: String },
  priceZone: { type: String },
  dailyRate: { type: String },
  enforceableTime: { type: String },
  maxTime: { type: String },
  parkingRestrictType: { type: String },
  parkingRestrictTime: { type: String },
  noStopping: { type: String },
  coordinates: {
    type: {
      type: String,
      enum: ["Point", "MultiLineString", "MultiPolygon"], // Allowing Point, MultiLineString, and MultiPolygon
      required: true,
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Allow different geospatial structures
      required: true,
    },
  },
  neighborhood: { type: String },
});

// Add geospatial index for StreetParkingSchema
StreetParkingSchema.index({ "coordinates.coordinates": "2dsphere" });

// Model definition for street parking
export const StreetParking = mongoose.model("StreetParking", StreetParkingSchema, "street");

// Zone Schema
export const zoneSchema = new mongoose.Schema(
  {
    zone: String,
    price: String,
  },
  {
    collection: "Zones",
    strict: false,
  }
);

// Model definition for Zones
export const Zone = mongoose.model("Zone", zoneSchema);

// Unified Parking Schema
const unifiedParkingSchema = new mongoose.Schema({
  globalid: { type: String, default: null },
  parkingZone: { type: String, default: null },
  title: { type: String, default: null },
  url: { type: String, default: null },
  parkingRates: [
    {
      period: { type: String, default: null },
      hours: { type: String, default: null },
      rate: { type: String, default: null },
      max: { type: String, default: null },
    },
  ],
  address: { type: String, default: null },
  blockSide: { type: String, default: null },
  zoneType: { type: String, default: null },
  stallType: { type: String, default: null },
  permitZone: { type: String, default: null },
  status: { type: String, default: null },
  priceZone: { type: String, default: null },
  dailyRate: { type: String, default: null },
  enforceableTime: { type: String, default: null },
  maxTime: { type: String, default: null },
  parkingRestrictType: { type: String, default: null },
  parkingRestrictTime: { type: String, default: null },
  noStopping: { type: String, default: null },
  coordinates: {
    type: {
      type: String,
      enum: ["Point", "MultiLineString", "MultiPolygon"], // Allowing Point, MultiLineString, and MultiPolygon
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed, // Allow different geospatial structures
    },
  },
  neighborhood: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, default: null }, // Traceability: "ParkingRate" or "StreetParking"
});

// Add geospatial index for Unified Parking coordinates
unifiedParkingSchema.index({ coordinates: "2dsphere" });

// Model definition for Unified Parking
export const UnifiedParking = mongoose.model("UnifiedParking", unifiedParkingSchema, "unified_parking");

// Connect to MongoDB using mongoose
export async function connectDb() {
  try {
    // Ensure that `mongo_uri` is correctly defined and accessible
    await mongoose.connect(mongo_uri); 
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectDb() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
}