const Endpoint = require("../models/endpoint.model.js");
const { scheduleEndpointHealth, removeEndpointHealthSchedule  } = require("../queues/endpoint.queue.js");

const createEndpoint = async (req, res) => {
    const { name, url, method, expectedStatus, expectedResponse, headers, body, timeout, frequency, enabled } = req.body;
    const userId = req.user.id;
    if(!name || !url || !method || !headers){
        return res.status(400).json({
            message: "Name, URL, Method, and Headers of the endpoint are required."
        })
    }

    try {
        const newEndpoint = await Endpoint.create({
            name,
            url,
            method,
            expectedStatus: expectedStatus || 200,
            expectedResponse: expectedResponse || '',
            headers: headers || {},
            timeout: timeout || 5000,
            frequency: frequency || 50,
            body: body || null,
            enabled: enabled !== undefined ? enabled : true,
            userId
        });

        await scheduleEndpointHealth(newEndpoint);
        return res.status(201).json({
            message: "Endpoint created successfully.",
            endpoint: newEndpoint
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating endpoint.",
            error: error.message
        })
    }
}

const getEndpoints = async (req, res) => {
    const userId = req.user.id;

    try {
        const endpoints = await Endpoint.find({ userId });
        return res.status(200).json({
            message: "Endpoints retrieved successfully.",
            endpoints
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving endpoints.",
            error: error.message
        })
    }
}

const getEndpointById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const endpoint = await Endpoint.findOne({ _id: id, userId });
        if(!endpoint){
            return res.status(404).json({
                message: "Endpoint not found."
            })
        }
        return res.status(200).json({
            message: "Endpoint retrieved successfully.",
            endpoint
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving endpoint.",
            error: error.message
        })
    }
}

const updateEndpoint = async (req, res) => {
    const { id } = req.params;
    const { name, url, method, expectedStatus, expectedResponse, headers, body, timeout, frequency, enabled } = req.body;
    const userId = req.user.id;

    try {
        const endpoint = await Endpoint.findOne({ _id: id, userId });
        if (!endpoint) {
            return res.status(404).json({ message: "Endpoint not found." });
        }

        // 1. Snapshot prior scheduling states
        const wasEnabled = endpoint.enabled;
        const frequencyChanged = frequency !== undefined && frequency !== endpoint.frequency;
        const enabledChanged = enabled !== undefined && enabled !== endpoint.enabled;

        // 2. Safely apply basic value types
        endpoint.name = name ?? endpoint.name;
        endpoint.url = url ?? endpoint.url;
        endpoint.method = method ?? endpoint.method;
        endpoint.expectedStatus = expectedStatus ?? endpoint.expectedStatus;
        endpoint.expectedResponse = expectedResponse ?? endpoint.expectedResponse;
        endpoint.timeout = timeout ?? endpoint.timeout;
        endpoint.frequency = frequency ?? endpoint.frequency;
        endpoint.enabled = enabled !== undefined ? enabled : endpoint.enabled;

        // 3. Handle Mongoose Schema.Types.Mixed safely
        if (body !== undefined) {
            endpoint.body = body;
            endpoint.markModified('body');
        }

        // 4. Handle Mongoose Map safely
        if (headers !== undefined) {
            endpoint.headers = headers;
            endpoint.markModified('headers'); 
        }

        // 5. Save document (validates HTTP method enums & required constraints)
        await endpoint.save();

        // 6. BullMQ Lifecycle Coordination
        if (endpoint.enabled) {
            if (!wasEnabled || frequencyChanged) {
                await scheduleEndpointHealth(endpoint);
            }
        } else {
            if (enabledChanged) {
                await removeEndpointHealthSchedule(endpoint._id);
            }
        }

        return res.status(200).json({
            message: "Endpoint updated successfully.",
            endpoint
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating endpoint.",
            error: error.message
        });
    }
};

const deleteEndpoint = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const endpoint = await Endpoint.findOne({ _id: id, userId });
        if (!endpoint) {
            return res.status(404).json({
                message: "Endpoint not found."
            });
        }

        await removeEndpointHealthSchedule(id);
        await Endpoint.findOneAndDelete({ _id: id, userId });

        return res.status(200).json({
            message: "Endpoint deleted successfully."
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting endpoint.",
            error: error.message
        })
    }
}

module.exports = {
    createEndpoint,
    getEndpoints,
    getEndpointById,
    updateEndpoint,
    deleteEndpoint
}