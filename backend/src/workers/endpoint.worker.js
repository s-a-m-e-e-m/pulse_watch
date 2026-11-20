const { Worker } = require("bullmq");
const { removeEndpointHealthSchedule } = require("../queues/endpoint.queue.js");

const connection = require("../services/redis");

const { checkEndpointHealth } = require("../controllers/healthlog.controller");
const sendEmail = require("../utils/sendAlert.js");

const worker = new Worker(
    "endpoint-health",
    async (job) => {
        let result;
        try {
            result = await checkEndpointHealth(job.data.endpointId);
        } catch (err) {
            if (err.code === "ENDPOINT_NOT_FOUND") {
                await removeEndpointHealthSchedule(job.data.endpointId);
                console.log(`Endpoint ${job.data.endpointId} not found. Removed from health check schedule.`);
                return null;
            }

            throw err;
        }

        if(!result) {
            return null;
        }

        const { health, transition, email } = result;

        if(transition === "DOWN"){
            await sendEmail(
                email,
                // `Endpoint ${health.endpointId} is DOWN`
                health
            );
        }
        else if(transition === "RECOVERED"){
            await sendEmail(
                email,
                // `Endpoint ${health.endpointId} has recovered`
                health
            )
        }

        return result
    },
    {
        connection,
        limiter: {
            max: 5,
            duration: 1000
        },
        concurrency: 10
    }
);

worker.on("ready", () => {
    console.log("Endpoint health worker is ready");
});

worker.on("completed", (job, result) => {
    console.log(
        `Health check completed for endpoint ${job.data.endpointId}:`
    );
});

worker.on("failed", (job, error) => {
    console.error(
        `Health check failed for endpoint ${job?.data?.endpointId || "unknown"}:`,
        error
    );
});

worker.on("error", (error) => {
    console.error("Endpoint health worker error:", error);
});

module.exports = worker;