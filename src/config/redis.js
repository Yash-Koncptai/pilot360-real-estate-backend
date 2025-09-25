const { createClient } = require("redis");

const client = createClient({
  socket: {
    host: process.env.REDIS_IP ,
    port: process.env.REDIS_PORT ,
  },
});

client.on("error", (err) => console.error("❌ Redis Client Error:", err));

async function connectRedis() {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
    process.exit(1); 
  }
}

module.exports = {
  client,
  connectRedis,
};
