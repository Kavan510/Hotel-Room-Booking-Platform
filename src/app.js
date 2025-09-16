import express from "express";
import cors from "cors";
import morgan from "morgan";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

// ----- Middlewares -----
app.use(express.json()); // Parse JSON request body( inbuild middleware)
app.use(cors());         // Enable CORS
app.use(morgan("dev"));  // Logging

// ----- Routes -----
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);



export default app;
