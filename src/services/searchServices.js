// Simple in-memory cache for search results
const searchCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function makeCacheKey({ city, name, page, limit }) {
  return JSON.stringify({ city, name, page, limit });
}

function setCache(key, value) {
  searchCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
}

function getCache(key) {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    searchCache.delete(key);
    return null;
  }
  return entry.value;
}
import hotelModel from "../models/hotelModel.js";

let hotels = [];
let cityIndex = new Map();   // cityLower -> [hotel,...]
let nameIndex = new Map();   // nameLower -> [hotel,...]
let cityKeys = [];           // cached list of city keys
let nameKeys = [];           // cached list of name keys

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
      // Only fetch required fields (much faster than pulling entire docs)
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

// const isHotelsLoaded = () => hotels.length > 0;

// const searchHotels = ({ city, name, limit = 100 }) => {
//   if (!isHotelsLoaded()) {
//     loadHotelsInMemory();
//     // throw new Error("Hotels not loaded. Call loadHotelsInMemory() first.");
//   }

//   const qCity = normalize(city) || null;
//   const qName = normalize(name) || null;
//   if (!qCity && !qName) return [];

//   const hotelsByCityQuery = (q) => {
//     if (!q) return null;
//     const exact = cityIndex.get(q);
//     if (exact && exact.length) return exact;
//     const matchedKeys = cityKeys.filter((k) => k.includes(q));
//     return matchedKeys.flatMap((k) => cityIndex.get(k) || []);
//   };

//   const hotelsByNameQuery = (q) => {
//     if (!q) return null;
//     const exact = nameIndex.get(q);
//     if (exact && exact.length) return exact;
//     const matchedKeys = nameKeys.filter((k) => k.includes(q));
//     return matchedKeys.flatMap((k) => nameIndex.get(k) || []);
//   };

//   let resultIds = null;

//   if (qCity) {
//     const cityMatches = hotelsByCityQuery(qCity) || [];
//     resultIds = new Set(cityMatches.map((h) => h._id.toString()));
//   }

//   if (qName) {
//     const nameMatches = hotelsByNameQuery(qName) || [];
//     const nameSet = new Set(nameMatches.map((h) => h._id.toString()));
//     resultIds =
//       resultIds === null
//         ? nameSet
//         : new Set([...resultIds].filter((id) => nameSet.has(id)));
//   }

//   if (!resultIds || resultIds.size === 0) return [];

//   const results = [];
//   for (const h of hotels) {
//     if (resultIds.has(h._id.toString())) {
//       results.push(h);
//       if (results.length >= limit) break;
//     }
//   }

//   return results;
// };


/**
 * Efficiently search hotels in MongoDB for large datasets (1M+ records) with pagination.
 * Returns { results, total, page, limit, totalPages }
 *
 * @param {Object} params - Search params: city, name, limit, page
 * @returns {Object} { results, total, page, limit, totalPages }
 */
const searchHotels = async ({ city, name, limit = 100, page = 1 }) => {
  const cacheKey = makeCacheKey({ city, name, page, limit });
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const query = {};
  if (city) query.city = new RegExp(city, "i");   // case-insensitive search
  if (name) query.name = new RegExp(name, "i");

  // Ensure page and limit are positive integers
  const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 100, 1000));
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const skip = (safePage - 1) * safeLimit;

  // Get total count for pagination
  const total = await hotelModel.countDocuments(query);
  const results = await hotelModel.find(query).skip(skip).limit(safeLimit).lean();

  const response = {
    results,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit)
  };
  setCache(cacheKey, response);
  return response;
};


export { loadHotelsInMemory, searchHotels };
