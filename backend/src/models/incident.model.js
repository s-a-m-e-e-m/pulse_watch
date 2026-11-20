const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    endpointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Endpoint',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['ONGOING', 'RESOLVED'],
        required: true
    },
    reason: {
        type: String,
        required: true,
        default: 'Unknown'
    },
    acknowledged: {
        type: Boolean,
        default: false
    },
    aiAnalysis: {
        summary: {
            type: String,
            default: ''
        },
        probableRootCause: {
            type: String,
            default: ''
        },
        recommendedAction: {
            type: [String],
            default: ["No recommended action available"]
        },
        severityLevel: {
            type: String,
            enum: ['low', 'medium', 'high', ''],
            default: ''
        },
        generatedAt: {
            type: Date,
            default: new Date()
        }
    }
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;