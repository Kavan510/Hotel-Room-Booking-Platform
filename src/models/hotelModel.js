import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const hotelModel = mongoose.model("Hotel", hotelSchema);

export default hotelModel;
