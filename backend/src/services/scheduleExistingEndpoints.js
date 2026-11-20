const Endpoint = require("../models/endpoint.model.js");
const { scheduleEndpointHealth } = require("../queues/endpoint.queue.js");

async function scheduleExistingEndpoints() {
    const cursor = Endpoint.find({ enabled: true })
        .select("_id url frequency")
        .lean()
        .cursor();

    for await (const endpoint of cursor) {
        await scheduleEndpointHealth(endpoint);
    }

    console.log("Scheduled health checks for all existing endpoints.");
}

module.exports = scheduleExistingEndpoints;