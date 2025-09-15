import { Router } from "express";
import {
  createHotel,
  getHotels,
  getHotelWithRooms,
} from "../controllers/hotelController.js";
getHotels;
const hotelRoutes = Router();

hotelRoutes.post("/", createHotel);

hotelRoutes.get("/", getHotels);

// hotelRoutes.get("/:id", getHotelWithRooms);

export default hotelRoutes;
