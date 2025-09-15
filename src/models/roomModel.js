import mongoose from "mongoose";


const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Suite"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const roomModel = mongoose.model("Room", roomSchema);

export default roomModel;
