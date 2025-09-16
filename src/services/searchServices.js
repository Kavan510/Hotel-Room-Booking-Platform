import hotelModel from "../models/hotelModel.js";

let hotels = [];
let cityIndex = new Map();   // cityLower -> [hotel,...]
let nameIndex = new Map();   // nameLower -> [hotel,...]
let cityKeys = [];           // cached list of city keys for partial matching
let nameKeys = [];           // cached list of name keys for partial matching

// Prevent concurrent loads
let loadingPromise = null;

const normalize = (s) => (s ? s.toString().trim().toLowerCase() : "");

/**
 * Load hotels into memory and build simple indexes.
 * Safe to call concurrently: subsequent callers will await the same promise.
 */
const loadHotelsInMemory = async () => {
  if (hotels.length > 0) return;        // already loaded
  if (loadingPromise) return loadingPromise;

  console.time("loadHotels");
  loadingPromise = (async () => {
hotels = await hotelModel.find().lean();
console.timeEnd("loadHotels");
console.log(`Loaded ${hotels.length} hotels into memory`);

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

    console.log(`Loaded ${hotels.length} hotels into memory (${cityIndex.size} unique cities).`);
    loadingPromise = null;
  })();

  return loadingPromise;
};

 const isHotelsLoaded = () => hotels.length > 0;

const searchHotels = ({ city, name, limit = 100 }) => {
  const qCity = normalize(city) || null;
  const qName = normalize(name) || null;

  if (!qCity && !qName) return [];

  // Helper to produce array of hotels for a city (exact or partial)
  const hotelsByCityQuery = (q) => {
    if (!q) return null;
    let matched = cityIndex.get(q);
    if (matched && matched.length) return matched;
    // partial match on city keys (few keys so this is cheap)
    const matchedKeys = cityKeys.filter(k => k.includes(q));
    if (!matchedKeys.length) return [];
    const acc = [];
    for (const k of matchedKeys) {
      acc.push(...(cityIndex.get(k) || []));
    }
    return acc;
  };

  // Helper for name (exact or partial)
  const hotelsByNameQuery = (q) => {
    if (!q) return null;
    let matched = nameIndex.get(q);
    if (matched && matched.length) return matched;
    const matchedKeys = nameKeys.filter(k => k.includes(q));
    if (!matchedKeys.length) return [];
    const acc = [];
    for (const k of matchedKeys) {
      acc.push(...(nameIndex.get(k) || []));
    }
    return acc;
  };

  let resultIds = null; // Set of hotel._id strings

  // Apply city filter
  if (qCity) {
    const cityMatches = hotelsByCityQuery(qCity) || [];
    const set = new Set(cityMatches.map(h => h._id.toString()));
    resultIds = set;
  }

  // Apply name filter (intersect with city if both present)
  if (qName) {
    const nameMatches = hotelsByNameQuery(qName) || [];
    const nameSet = new Set(nameMatches.map(h => h._id.toString()));

    if (resultIds === null) {
      resultIds = nameSet;
    } else {
      // intersection
      resultIds = new Set([...resultIds].filter(id => nameSet.has(id)));
    }
  }

  if (!resultIds || resultIds.size === 0) return [];

  // Build final results preserving original hotel objects and apply limit
  const results = [];
  for (const h of hotels) {
    if (resultIds.has(h._id.toString())) {
      results.push(h);
      if (results.length >= limit) break;
    }
  }

  return results;
};

export {loadHotelsInMemory,isHotelsLoaded,searchHotels};