import { Router } from "express";
import {
  createHotel,
  getHotels,
  searchHotelController,
} from "../controllers/hotelController.js";


const hotelRoutes = Router();

hotelRoutes.post("/", createHotel);

hotelRoutes.get("/", getHotels);

hotelRoutes.get('/search',searchHotelController)
// hotelRoutes.get("/:id", getHotelWithRooms);

export default hotelRoutes;
