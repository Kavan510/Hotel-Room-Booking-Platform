import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { loadHotelsInMemory } from "./services/searchServices.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// First connect DB then sstart server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
// loadHotelsInMemory().catch(err => {
//   console.error("Failed to preload hotels:", err);
// });