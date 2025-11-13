const { createClient } = require("redis");

const client = createClient({url: "redis://127.0.0.1:6379"});
(async () => {
  try {
    await client.connect();
    console.log("✅ Successfully connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection error:", err);
  }
})();
module.exports = client;