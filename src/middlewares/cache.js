const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl; // unique key: /api/hotels/search?city=Goa
  const cached = cache.get(key);

  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log("Serving from cache:", key);
    return res.status(200).json(cached.data);
  }

  // Override res.json to store result in cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, { data: body, timestamp: Date.now() });
    return originalJson(body);
  };

  next();
};

export default cacheMiddleware;