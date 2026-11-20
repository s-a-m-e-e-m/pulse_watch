const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
    endpointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Endpoint',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['UP', 'DOWN'],
        // required: true
    },
    statusCode: {
        type: Number,
        // required: true
    },
    latency: {
        type: Number,
        // required: true
    },
    responseBody: {
        type: String
    },
    checkedAt: {
        type: Date,
        default: new Date(),
        index: true
    }
});

const HealthLog = mongoose.model("HealthLog", healthLogSchema);

module.exports = HealthLog;