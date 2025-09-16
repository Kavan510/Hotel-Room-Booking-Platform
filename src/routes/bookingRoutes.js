import { Router } from "express";
import { bookRoom } from "../controllers/bookingController.js";
import { bookingRateLimiter } from "../middlewares/rateLimiter.js";
bookRoom
const bookingRoutes =   Router();

// ===========<< API for booking room >> ==========

bookingRoutes.post('/:room',bookingRateLimiter,bookRoom);

export default bookingRoutes;