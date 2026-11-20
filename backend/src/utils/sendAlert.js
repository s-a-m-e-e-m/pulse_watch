const nodemailer = require("nodemailer");
const Alert = require("../models/alert.model.js");
const Incident = require("../models/incident.model.js");
const generateAIReport = require("../services/ai.service.js");
const { getIO } = require("../sockets/socket.js");

// interface Health {
//     endpointId: string;
//     status: string;
//     statusCode: number | null;
//     latency: number;
//     responseBody: string;
//     checkedAt: Date;
//     id: string;
// }

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (senderEmail, health) => {
    if(!senderEmail){
        throw new Error("Sender email is required")
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: senderEmail,
            replyTo: senderEmail,
            subject: `Alert: API Crashed`,
            html: `<p>Your API with endpoint ID ${health.endpointId} is ${health.status}.</p>
                   <p>Status Code: ${health.statusCode || "N/A"}</p>
                   <p>Latency: ${health.latency} ms</p>
                   <p>Response Body: ${health.responseBody}</p>
                   <p>Checked At: ${health.checkedAt}</p>
                   <h6>Note: This is an automated message. Please do not reply to this email.</h6>
                   <p>Regards,</p>
                   <p>API Monitoring Team</p>
                   <h4>PingAPI</h4>`
        })

        const alert = await Alert.create({
            endpointId: health.endpointId,
            type: "EMAIL",
            message: `Your API with endpoint ID ${health.endpointId} is ${health.status}.`,
            sent: true,
            sentAt: new Date()
        });

        getIO().emit("alert-sent", alert);

        if (health.status === "DOWN") {
            let incident = await Incident.findOne({
                endpointId: health.endpointId,
                status: "ONGOING"
            }).sort({ startTime: -1 });

            if (!incident) {
                incident = await Incident.create({
                    endpointId: health.endpointId,
                    startTime: new Date(),
                    status: "ONGOING",
                    reason: "API is DOWN"
                });
            }

            try {
                const analysis = await generateAIReport(health);

                await Incident.findByIdAndUpdate(
                    incident._id,
                    {
                        $set: {
                            "aiAnalysis.summary": analysis.summary,
                            "aiAnalysis.probableRootCause": analysis.probableRootCause,
                            "aiAnalysis.recommendedAction": analysis.recommendedAction,
                            "aiAnalysis.severityLevel": analysis.severityLevel,
                            "aiAnalysis.generatedAt": new Date()
                        }
                    },
                    { runValidators: true }
                );
            } catch (error) {
                console.error(
                    `Failed to generate AI analysis for incident ${incident._id}:`,
                    error
                );
            }
        }

        if (health.status === "UP") {
            const ongoingIncident = await Incident.findOne({
                endpointId: health.endpointId,
                status: "ONGOING"
            }).sort({ startTime: -1 });

            if (ongoingIncident) {
                await Incident.findByIdAndUpdate(ongoingIncident._id, {
                    endTime: new Date(),
                    status: "RESOLVED",
                    reason: "API is UP"
                });
            }
        }

    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

module.exports = sendEmail