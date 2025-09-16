import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";
import roomModel from "../models/roomModel.js";
import { isRoomBooked } from "../services/bookingService.js";

const bookRoom = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { room } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Ensure room exists
    const existingRoom = await roomModel.findById(room).session(session);
    if (!existingRoom) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Check overlapping booking INSIDE the transaction
    const overlapping = await isRoomBooked(room, checkIn, checkOut, session);
    if (overlapping) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Room already booked for these dates" });
    }

    // Create booking
    const booking = new bookingModel({
      room: room,
      hotel: existingRoom.hotel,
      checkInDate: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      totalPrice: existingRoom.price,
      status: "booked"
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export { bookRoom };
