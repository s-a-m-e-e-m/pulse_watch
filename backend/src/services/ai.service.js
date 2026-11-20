const { GoogleGenAI } = require("@google/genai");
const Incident = require("../models/incident.model.js");
const HealthLog = require("../models/healthlog.model.js");
const Endpoint = require("../models/endpoint.model.js");

const z = require("zod");

const ai = new GoogleGenAI({});

const analysisJsonSchema = {
    type: "object",
    properties: {
        summary: {
            type: "string",
            description: "A brief summary of the incident"
        },
        probableRootCause: {
            type: "string",
            description: "The most likely cause of the incident"
        },
        recommendedAction: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Recommended actions to address the incident"
        },
        severityLevel: {
            type: "string",
            enum: ['low', 'medium', 'high'],
            description: "The severity level of the incident"
        }
    }
}

const analysisSchema = z.fromJSONSchema(analysisJsonSchema);

const generateAIReport = async (health) => {
    const endpoint = await Endpoint.findById(health.endpointId).select("name method expectedStatus latestStatus latestLatency lastCheckedAt lastStatusCode");
    const freshHealthLogs = await HealthLog.find({ endpointId: health.endpointId })
        .select("status statusCode latency checkedAt createdAt")
        .sort({ createdAt: -1 })
        .limit(3);


    const PROMPT = `You are an API monitoring assistant.
                    Analyze the following incident.
                    Endpoint Name: ${endpoint.name}
                    Method: ${endpoint.method}
                    Expected Status: ${endpoint.expectedStatus}
                    Latest Status: ${endpoint.latestStatus}
                    Latest Latency: ${endpoint.latestLatency}
                    Last Checked At: ${endpoint.lastCheckedAt}
                    Last Status Code: ${endpoint.lastStatusCode}
                    Recent Health Logs of ${endpoint.name}: ${JSON.stringify(freshHealthLogs)}.\n\n
                    
                    Provide 1. probable root cause 2. recommended action 3. severity level (low, medium, high)`;

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: PROMPT,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: analysisJsonSchema
        }
    });

    const analysis = analysisSchema.parse(JSON.parse(interaction.output_text));
    return analysis;
}

module.exports = generateAIReport;