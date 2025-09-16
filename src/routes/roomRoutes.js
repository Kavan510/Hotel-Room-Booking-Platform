import { Router } from "express";
import { createRoom, getRoomsByHotel } from "../controllers/roomController.js";

const roomRoutes = Router();

// ===============<< API for adding room in specified hotel >> ============

roomRoutes.post('/',createRoom)

// ================<< Get rooms based on Hotel API >> ============

roomRoutes.get('/:hotelId',getRoomsByHotel)

// roomRoutes.put('/:id',)
export default roomRoutes;
