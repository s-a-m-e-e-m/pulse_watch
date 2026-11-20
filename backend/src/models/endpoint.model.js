const mongoose = require("mongoose");

const endpointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        enum: {
            values: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
            message: '{VALUE} is not a valid HTTP method.'
        },
        required: true
    },
    expectedStatus: {
        type: Number,
        required: true,
        default: 200
    },
    expectedResponse: {
        type: String,
        default: ''
    },
    headers: {
        type: Map,
        of: String,
        default: {}
    },
    body: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    timeout: {
        type: Number,
        default: 5000
    },
    frequency: {
        type: Number,
        default: 50
    },
    enabled: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    latestStatus: {
        type: String,
        enum: ['UP', 'DOWN'],
        default: 'UP'
    },
    latestLatency: {
        type: Number,
        default: null
    },
    lastCheckedAt: {
        type: Date,
        default: null
    },
    lastStatusCode: {
        type: Number,
        default: null
    }
}, { timestamps: true });

const Endpoint = mongoose.model("Endpoint", endpointSchema);

module.exports = Endpoint;