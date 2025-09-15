import mongoose from "mongoose";
import roomModel from "./roomModel.js";
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
  },
  { timestamps: true }
);

// hotelSchema.virtual("rooms", {
//   ref: "Room",
//   localField: "_id",
//   foreignField: "hotel",
// });

const hotelModel = mongoose.model("Hotel", hotelSchema);

export default hotelModel;
