

import bookingModel from "../models/bookingModel.js";

/**
 * Check if a room is already booked in the given date range
 * @param {String} roomId - Room ID
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @returns {Boolean} - true if overlapping booking exists
 */
export const isRoomBooked = async (roomId, checkIn, checkOut) => {
  const overlappingBooking = await bookingModel.findOne({
    room: roomId,
    $or: [
      { checkInDate: { $lt: new Date(checkOut) }, checkOutDate: { $gt: new Date(checkIn) } }
    ],
  });

  return !!overlappingBooking; // returns true if found
};
