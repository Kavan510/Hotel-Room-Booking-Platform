import { Router } from "express";
import { bookRoom } from "../controllers/bookingController.js";
bookRoom
const bookingRoutes =   Router();

bookingRoutes.post('/:room',bookRoom);

export default bookingRoutes;