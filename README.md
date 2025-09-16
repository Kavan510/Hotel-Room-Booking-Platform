
The goal of this project is to implement a **Hotel Room Booking Platform** where:

- Hotels can have multiple rooms of different types (Single, Double, Suite).
- Users can **book rooms** for a given date range.
- The system **prevents double bookings** (no overlapping reservations for the same room).
- Users can **search for hotels** by city or hotel name, even with a dataset of up to **1 million hotels**.
- Includes **mock data generation** for testing large-scale search.
- Significant Features include **caching** and **rate limiting**.

---

We designed this project with **modularity and scalability** in mind:

- **Models**: `Hotel`, `Room`, `Booking` (using Mongoose).
- **Services**:
  - `bookingService.js` → Validates date overlaps to prevent double booking.
  - `searchService.js` → Efficiently filters hotels (with mock data support).
- **Controllers**: Separate layers for cleaner code.
- **Middlewares**: Added caching and rate-limiting hooks.
- **Mock Data**: Scripts to generate millions of hotels and rooms for performance testing.
- **Routing**: Organized routing into separate files to enhance modularity and maintainability

---

- [express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) 
- npm as a package manager

---

## Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/Kavan510/Hotel-Room-Booking-Platform.git
   cd hotel-booking-platform
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Setup Environment Variables from `.env.example` file**
4. **Run in Development Mode (with Nodemon)**
   ```
   npm run dev
   ```
5. **Run in Production Mode**
   ```
   npm run start
   ```

## Seeding Data

```bash
npm run seed:hotels
npm run seed:rooms
```

## API Endpoint examples

1. **Hotels**

- Create new Hotel

```bash
POST: http://localhost:3000/api/hotels/
body:
{
  "name":"OceanView",
  "city":"Goa"
}
```

- Search Hotels

```bash
GET /api/hotels?city=Goa&page=2
```

2. **Rooms**

- Create a new room

```bash
POST: http://localhost:3000/api/rooms/
body:
{
  "hotel": "hotelId",
  "roomType": "Single",
  "price": 1200,
  "available": true 
}
```

- Get Rooms for hotels
```bash
GET: http://localhost:3000/api/rooms/:hotelId
```

3. **Booking Rooms**

- Booking of hotel room

```bash
POST: http://localhost:3000/api/bookings/:room

body:
{
  "checkIn":"2025-08-15",
  "checkOut":"2025-08-18"
}
```

## Complex Logic Explained

1. **Prevent double booking**
- Before saving a booking, we check for date overlap using MongoDB query. Its core logic is:
```bash
newcheckIn<existCheckOut && newCheckOut>existIn
````

2. **Pagination in Hotel Search**

- To handle large datasets efficiently, hotel search supports pagination using `page` and `limit` query params.

**Logic**

```js
const hotels = await hotelModel.find(query)
const hotels = await Hotel.find(query)
  .skip((page - 1) * limit)
  .limit(Number(limit));
```

**Example:**

```bash
GET /api/hotels?city=Goa&page=2
GET /api/hotels?city=Goa&page=2&limit=5
```

## Special Considerations

- Date Validation: Prevents invalid check-in/check-out and overlapping bookings.

- Hotel–Room Relationship: Hotels and rooms are separate models, linked via Mongoose virtuals for scalability.

- Error Handling: Consistent JSON responses with clear error messages.

- Scalability: Mock data generators + indexes enable search across 1M+ hotels; caching can be added for optimization.

- Rate Limiting: Middleware included to handle traffic spikes and protect booking endpoints.
