const Alert = require("../models/alert.model.js");
const Endpoint = require("../models/endpoint.model.js");

const allAlerts = async (req, res) => {
    try {
        const userId = req.user.id;

        //1. find all endpoints belongings to the logged-in user
        const endpoints = await Endpoint.find({ userId }).select("_id");

        const endpointIds = endpoints.map(endpoint => endpoint._id);

        //2. find all alerts associated with those endpoints
        const alerts = await Alert.find({
            endpointId: { $in: endpointIds }
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All alerts",
            alerts
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error})
    }
}

const alertById = async (req, res) => {
    try {
        const { alertId } = req.params;
        const alert = await Alert.findById(alertId);

        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        return res.status(200).json({
            alert
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const alertsByEndpointId = async (req, res) => {
    try {
        const { endpointId } = req.params;
        const alerts = await Alert.find({ endpointId });

        return res.status(200).json({
            alerts
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = {
    allAlerts,
    alertById,
    alertsByEndpointId
};