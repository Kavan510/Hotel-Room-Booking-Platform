import roomModel from "../models/roomModel.js";
import hotelModel from "../models/hotelModel.js";

// Create a room 
 const createRoom = async (req, res) => {
  try {
    const { hotel, roomType, price, available } = req.body;

    // Check if hotel exists
    const existingHotel = await hotelModel.findById(hotel);
    if (!existingHotel) {
      return res.status(404).json({ success: false, message: "hotelModel not found" });
    }

    const room = new roomModel({
      hotel,
      roomType,
      price,
      available
    });

    await room.save();

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all rooms for a given hotel 
const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const rooms = await roomModel.find({ hotel: hotelId });

    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export {
    createRoom,getRoomsByHotel
}