import express from "express";
import cors from "cors";
import morgan from "morgan";

import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ----- Middlewares -----
app.use(express.json()); // Parse JSON request body
app.use(cors());         // Enable CORS
app.use(morgan("dev"));  // Logging

// ----- Routes -----
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// ----- Error Handling -----
app.use(errorHandler);

export default app;
