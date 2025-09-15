import Hotel from "../models/hotelModel.js";

// Create a hotel
const createHotel = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ success: false, message: "Name and city are required" });
    }

    const hotelData = {
      name:name,
      city:city
    }
    const hotel = Hotel.create(hotelData);

    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get hotels (with optional filters)
const getHotels = async (req, res) => {
  try {
    const { city, name } = req.query;

    let query = {};
    if (city) query.city = new RegExp(city, "i");  // case-insensitive
    if (name) query.name = new RegExp(name, "i");

    const hotels = await Hotel.find(query);

    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


export {createHotel,getHotels};