import hotelModel from "../models/hotelModel.js";

// In-memory indexes
let hotels = [];
let cityIndex = {};
let nameIndex = {};

const loadHotelsInMemory = async () => {
  hotels = await hotelModel.find().lean();

  // Build indexes
  cityIndex = {};
  nameIndex = {};

  for (const hotel of hotels) {
    // City index
    const cityKey = hotel.city.toLowerCase();
    if (!cityIndex[cityKey]) cityIndex[cityKey] = [];
    cityIndex[cityKey].push(hotel);

    // Name index
    nameIndex[hotel.name.toLowerCase()] = hotel;
  }

  console.log(`Loaded ${hotels.length} hotels into memory`);
};

// Search hotels
const searchHotels = (filters) => {
  const { city, name } = filters;

  let results = hotels;

  if (city) {
    results = cityIndex[city.toLowerCase()] || [];
  }

  if (name) {
    const hotel = nameIndex[name.toLowerCase()];
    results = hotel ? [hotel] : [];
  }

  return results;
};

export  {loadHotelsInMemory, searchHotels};