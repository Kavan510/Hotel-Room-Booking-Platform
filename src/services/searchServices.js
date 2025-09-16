import hotelModel from "../models/hotelModel.js";

let hotels = [];
let cityIndex = new Map(); // city -> [hotel,...]
let nameIndex = new Map(); // name -> [hotel,...]
let cityKeys = []; // cached list of city keys
let nameKeys = []; // cached list of name keys

// Prevent concurrent loads
let loadingPromise = null;

const normalize = (s) => (s ? s.toString().trim().toLowerCase() : "");

/**
 * Load hotels into memory and build simple indexes.
 * Call this once at app startup to avoid repeated slow loads.
 */
const loadHotelsInMemory = async () => {
  if (hotels.length > 0) return;
  if (loadingPromise) return loadingPromise;

  console.time("loadHotels");
  loadingPromise = (async () => {
    try {
      // Only fetch required fields
      hotels = await hotelModel.find({}, { name: 1, city: 1 }).lean();
      hotels = hotels || [];

      cityIndex = new Map();
      nameIndex = new Map();

      for (const h of hotels) {
        const ck = normalize(h.city);
        const nk = normalize(h.name);

        if (!cityIndex.has(ck)) cityIndex.set(ck, []);
        cityIndex.get(ck).push(h);

        if (!nameIndex.has(nk)) nameIndex.set(nk, []);
        nameIndex.get(nk).push(h);
      }

      cityKeys = Array.from(cityIndex.keys());
      nameKeys = Array.from(nameIndex.keys());

      console.log(
        `Loaded ${hotels.length} hotels into memory (${cityIndex.size} unique cities).`
      );
    } finally {
      console.timeEnd("loadHotels");
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};


// =============================<< Below function Search hotels based on filter  >> ======================

/**
 * @param {Object} params - Search params: city, name, limit, page
 * @returns {Object} { results, total, page, limit, totalPages }
 */
const searchHotels = async ({ city, name, limit = 100, page = 1 }) => {
  // const cacheKey = makeCacheKey({ city, name, page, limit });
  // const cached = getCache(cacheKey);
  // if (cached) return cached;

  const query = {};
  if (city) query.city = new RegExp(city, "i"); // case-insensitive search
  if (name) query.name = new RegExp(name, "i");

  // Ensure page and limit are positive integers
  const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 100, 1000));
  const safePage = Math.max(1, parseInt(page, 10) || 1);

  // skip the pages before current page

  const skip = (safePage - 1) * safeLimit;

  // Get total count for pagination
  const total = await hotelModel.countDocuments(query);
  const results = await hotelModel
    .find(query)
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const response = {
    results,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
  // setCache(cacheKey, response);
  return response;
};

export { loadHotelsInMemory, searchHotels };
