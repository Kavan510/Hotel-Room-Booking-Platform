import hotelModel from "../models/hotelModel.js";
import {  searchHotels,loadHotelsInMemory } from "../services/searchServices.js";

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
    const hotel = hotelModel.create(hotelData);

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

    const hotels = await hotelModel.find(query);

    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get hotel with its rooms
export const getHotelWithRooms = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await hotelModel.findById(id).populate("rooms");

    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const searchHotelController = async (req, res) => {
  try {
    const limit=100;
    const {name,city,page} = req.query;
console.log(city);

    if (!city || !name) {
      return res.status(400).json({ success: false, message: "Invalid query. Use ?city=<city> or ?name=<hotel>" });
    }

    const results = searchHotels({ city, name, limit: Number(limit), page: Number(page) });

    return res.status(200).json({
      success: true,
      count: results.length,
      page: Number(page),
      limit: Number(limit),
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  //   try {
  //   const { city, name } = req.query;
  //   const query = {};

  //   if (city) query.city = { $regex: `^${city}`, $options: "i" }; // prefix match
  //   if (name) query.name = { $regex: `^${name}`, $options: "i" };

  //   const results = await hotelModel.find(query).limit(100);

  //   return res.status(200).json({
  //     success: true,
  //     count: results.length,
  //     data: results,
  //   });
  // } catch (error) {
  //   return res.status(500).json({ success: false, message: error.message });
  // }
};

export {createHotel,getHotels,searchHotelController};