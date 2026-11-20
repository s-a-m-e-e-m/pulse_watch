const Incident = require("../models/incident.model.js")
const Endpoint = require("../models/endpoint.model.js");

const allIncidents = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. find all endpoints belongings to the logged-in user
        const endpoints = await Endpoint.find({ userId }).select("_id");

        const endpointIds = endpoints.map(endpoint => endpoint._id);

        //2. find all incidents associated with those endpoints
        const incidents = await Incident.find({
            endpointId: { $in: endpointIds }
        }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: "All incidents",
            incidents
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const incidentById = async (req, res) => {
    try {
        const { incidentId } = req.params;

        const incident = await Incident.findById(incidentId);

        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }

        return res.status(200).json({
            message: "Incident details",
            incident
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const IncidentByEndpointId = async (req, res) => {
    try {
        const { endpointId } = req.params;
        const incidents = await Incident.find({ endpointId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Incidents by endpoint",
            incidents
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = {
    allIncidents,
    incidentById,
    IncidentByEndpointId
}