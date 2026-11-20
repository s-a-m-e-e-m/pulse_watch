const { Queue } = require("bullmq");

const connection = require("../services/redis");

const endpointQueue = new Queue("endpoint-health", {
    connection
});

async function scheduleEndpointHealth(endpoint) {
    await endpointQueue.upsertJobScheduler(
        `endpoint-${endpoint._id}`,
        {
            every: endpoint.frequency * 1000
        },
        {
            name: "health-check",
            data: { endpointId: endpoint._id.toString() },
            opts: {
                removeOnComplete: true,
                removeOnFail: 100
            }
        }
    );
}

async function removeEndpointHealthSchedule(endpointId) {
    await endpointQueue.removeJobScheduler(`endpoint-${endpointId}`);
}

module.exports = endpointQueue;
module.exports.scheduleEndpointHealth = scheduleEndpointHealth;
module.exports.removeEndpointHealthSchedule = removeEndpointHealthSchedule;