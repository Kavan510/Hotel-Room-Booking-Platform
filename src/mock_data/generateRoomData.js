import mongoose from "mongoose";
import dotenv from "dotenv";
import hotelModel from "../models/hotelModel.js";
import roomModel from "../models/roomModel.js";
import connectDB from "../config/db.js";

dotenv.config();

// Sample room types
const roomTypes = ["Single", "Double", "Suite", "Deluxe"];

function getRandomRoomType() {
  return roomTypes[Math.floor(Math.random() * roomTypes.length)];
}

function getRandomPrice() {
  return Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // ₹1000 - ₹5000
}

const seedRooms = async () => {
  try {
    await connectDB();

    console.log("Fetching hotels...");
    const hotels = await hotelModel.find().limit(10000).lean(); // pick 10k hotels

    if (!hotels.length) {
      console.log("No hotels found. Seed hotels first.");
      process.exit(1);
    }

    console.log(`Found ${hotels.length} hotels, generating rooms...`);

    const rooms = hotels.map((hotel, i) => ({
      hotel: hotel._id,
      roomType: getRandomRoomType(),
      price: getRandomPrice(),
      available: true,
    }));

    console.log("Inserting rooms into DB...");
    await roomModel.insertMany(rooms, { ordered: false });

    console.log("Successfully inserted 10,000 rooms!");
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding rooms:", err.message);
    process.exit(1);
  }
};

seedRooms();
