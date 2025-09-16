import { Router } from "express";
import { bookRoom } from "../controllers/bookingController.js";
import { bookingRateLimiter } from "../middlewares/rateLimiter.js";
bookRoom
const bookingRoutes =   Router();

bookingRoutes.post('/:room',bookingRateLimiter,bookRoom);

export default bookingRoutes;