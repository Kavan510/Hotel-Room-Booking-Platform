import rateLimit from "express-rate-limit";

// Limit booking requests: max 5 per minute per IP
export const bookingRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many booking attempts. Please try again later.",
  },
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false,  // disable X-RateLimit-* headers
});
