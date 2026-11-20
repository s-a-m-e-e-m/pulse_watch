const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
});

connection.on("connect", () => {
    console.log("Redis connected");
});

connection.on("ready", () => {
    console.log("Redis is ready");
});

connection.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

module.exports = connection;