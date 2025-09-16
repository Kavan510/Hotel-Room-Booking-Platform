import { Router } from "express";
import {
  createHotel,
  searchHotelController,
} from "../controllers/hotelController.js";
import cacheMiddleware from "../middlewares/cache.js";

const hotelRoutes = Router();
// --- API for crreate hotel ----
hotelRoutes.post("/", createHotel);

// ----- API for list all the current database hotel with filters

hotelRoutes.get("/search", cacheMiddleware, searchHotelController);

export default hotelRoutes;
