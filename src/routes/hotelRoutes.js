import { Router } from "express";
import { createHotel,getHotels } from "../controllers/hotelController.js";
getHotels
const hotelRoutes = Router();

hotelRoutes.post('/',createHotel);

hotelRoutes.get('/',getHotels);


export default hotelRoutes;
