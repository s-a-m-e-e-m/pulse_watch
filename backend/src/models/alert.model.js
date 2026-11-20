const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    endpointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Endpoint',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    },
    sentAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;