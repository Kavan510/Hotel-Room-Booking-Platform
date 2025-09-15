import { Router } from "express";
import { createRoom, getRoomsByHotel } from "../controllers/roomController.js";

const roomRoutes = Router();

roomRoutes.post('/',createRoom)


roomRoutes.get('/:hotelId',getRoomsByHotel)

// roomRoutes.put('/:id',)
export default roomRoutes;
