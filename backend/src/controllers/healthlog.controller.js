const Endpoint = require("../models/endpoint.model.js");
const HealthLog = require("../models/healthlog.model.js");
const { getIO } = require("../sockets/socket.js");

const checkApiHealth = async (endpoint, timeout = endpoint.timeout || 5000) => {
    const URL = endpoint.url;
    const headers = endpoint.headers instanceof Map
        ? Object.fromEntries(endpoint.headers)
        : endpoint.headers;
    const startTime = performance.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(URL, {
            method: endpoint.method,
            headers,
            body: endpoint.body && !["GET", "HEAD"].includes(endpoint.method)
                ? JSON.stringify(endpoint.body)
                : undefined,
            signal: controller.signal
        });

        // read the response body. This supports JSON, text, HTML, etc.
        const responseBody = await response.text();

        const endTime = performance.now();
        const latency = Math.round(endTime-startTime);

        return {
            status: response.ok ? "UP" : "DOWN",
            statusCode: response.status,
            latency,
            responseBody
        };
    } catch (error) {
        const endTime = performance.now();
        const latency = Math.round(endTime-startTime);

        return {
            status: "DOWN",
            statusCode: null,
            latency,
            responseBody: error.name === "AbortError" 
                ?   "Request timed out"
                :   error.message
        };
    } finally {
        clearTimeout(timeoutId)
    }
}

const checkEndpointHealth = async (endpointId) => {
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
        const error = new Error(`Endpoint with ID ${endpointId} not found.`);
        error.code = "ENDPOINT_NOT_FOUND";
        throw error;
    }

    if (!endpoint.enabled) {
        return null;
    }

    const result = await checkApiHealth(endpoint);
    const checkedAt = new Date();

    // check if the status has changed from UP to DOWN or vice versa
    const previousStatus = endpoint.latestStatus;
    const currentStatus = result.status;

    const transition = 
        previousStatus==="UP" && currentStatus==="DOWN"
            ? "DOWN"
            : previousStatus==="DOWN" && currentStatus==="UP"
                ? "RECOVERED"
                : null;

    const health = await HealthLog.create({
        endpointId: endpoint._id,
        status: result.status,
        statusCode: result.statusCode,
        latency: result.latency,
        responseBody: result.responseBody,
        checkedAt
    });

    await Endpoint.findByIdAndUpdate(endpoint._id, {
        latestStatus: result.status,
        latestLatency: result.latency,
        lastStatusCode: result.statusCode,
        lastCheckedAt: checkedAt
    });

    getIO().emit("health-update", health);

    let email = null;
    if(transition === "DOWN" || transition === "RECOVERED"){
        await endpoint.populate("userId", "email");
        email = endpoint.userId.email;
    }

    return { health, transition, email };
}

const getHealthLogs = async (req, res) => {
    const { endpointId } = req.params;

    try {
        const logs = await HealthLog.find({ endpointId }).sort({ checkedAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error(`Error fetching health logs for endpoint ${endpointId}:`, error);
        res.status(500).json({ message: "Error fetching health logs", error: error.message });
    }
}

module.exports = {
    checkApiHealth,
    checkEndpointHealth,
    getHealthLogs
};