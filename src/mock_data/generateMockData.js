import mongoose from "mongoose";
import dotenv from "dotenv";
import hotelModel from "../models/hotelModel.js";

dotenv.config();

const cities = ["Delhi", "Mumbai", "Goa", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune"];

function getRandomCity() {
  return cities[Math.floor(Math.random() * cities.length)];
}

function generateHotels(count) {
  const hotels = [];
  for (let i = 0; i < count; i++) {
    hotels.push({
      name: `Hotel_${i}_${Math.random().toString(36).substring(7)}`,
      city: getRandomCity(),
    });
  }
  return hotels;
}

const seedHotels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Deleting old hotels...");
    await hotelModel.deleteMany({});

    console.log("Generating hotels...");
    const hotels = generateHotels(1000000); // 1M

    console.log("Inserting into DB...");
    await hotelModel.insertMany(hotels, { ordered: false }); // bulk insert

    console.log("Successfully inserted 1M hotels");
    process.exit();
  } catch (err) {
    console.error("Error seeding hotels:", err.message);
    process.exit(1);
  }
};

seedHotels();
