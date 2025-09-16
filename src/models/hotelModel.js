import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      index: true, // create index on hotel name
    },
    city: {
      type: String,
      required: [true, "City is required"],
      index: true, // create index on city
    },
  },
  { timestamps: true }
);

// Optional: relation with rooms
// hotelSchema.virtual("rooms", {
//   ref: "Room",
//   localField: "_id",
//   foreignField: "hotel",
// });

const hotelModel = mongoose.model("Hotel", hotelSchema);

export default hotelModel;
