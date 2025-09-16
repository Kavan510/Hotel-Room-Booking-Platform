import { Router } from "express";
import {
  createHotel,
  getHotels,
  searchHotelController,
} from "../controllers/hotelController.js";
import cacheMiddleware from "../middlewares/cache.js";


const hotelRoutes = Router();

hotelRoutes.post("/", createHotel);

hotelRoutes.get("/", getHotels);

hotelRoutes.get('/search',cacheMiddleware,searchHotelController)


export default hotelRoutes;
