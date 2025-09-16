import bookingModel from "../models/bookingModel.js";

/**
 * Check if a room is already booked in the given date range
 * @param {String} roomId - Room ID
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @param {Object} session - Mongoose session (optional, for transactions)
 * @returns {Boolean} - true if overlapping booking exists
 */
export const isRoomBooked = async (roomId, checkIn, checkOut, session = null) => {
  const overlappingBooking = await bookingModel.findOne({
    room: roomId,
    status: "booked", // only consider active bookings
    checkInDate: { $lt: new Date(checkOut) },
    checkOutDate: { $gt: new Date(checkIn) }
  }).session(session);

  return !!overlappingBooking;
};
