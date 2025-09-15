import bookingModel from "../models/bookingModel.js";
import roomModel from "../models/roomModel.js";
import { isRoomBooked } from "../services/bookingService.js";

// Book a room
const bookRoom = async (req, res) => {
  try {
    const {room} = req.params;
    const { checkIn, checkOut } = req.body;

    if ( !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Ensure room exists
    const existingRoom = await roomModel.findById(room);
    if (!existingRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    const hotel = existingRoom.hotel;
    const price = existingRoom.price;
    // Check for overlapping bookings
    const overlappingBooking = await isRoomBooked(room,checkIn,checkOut)

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "Room already booked for given dates",
      });
    }

    // Create booking
    const bookingData = {
      room: room,
      hotel: hotel,
      checkInDate: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      totalPrice: price,
      status: "booked",
    };
    const booking = await bookingModel.create(bookingData);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export { bookRoom };
