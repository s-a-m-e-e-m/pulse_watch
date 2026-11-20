import { Link } from "react-router-dom";
import type { Incident } from "../types";

const IncidentTable = ({ incidents }: { incidents: Incident[] }) => {
    if (!incidents || incidents.length === 0) {
        return (
            <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-10 text-center">
                <h2 className="text-2xl font-semibold text-[#ededed]">
                    No Incidents Found
                </h2>
                <p className="mt-2 text-[#888]">
                    Great! No incidents have been reported yet.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-[#333333] bg-[#161616]">
            <div className="border-b border-[#333333] px-6 py-4">
                <h2 className="text-2xl font-bold text-[#ededed]">
                    Incident History
                </h2>
                <p className="mt-1 text-sm text-[#888]">
                    Complete record of all incidents detected by the monitoring system.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-[#161616] text-sm">
                    <thead className="bg-[#161616]">
                        <tr className="border-b border-[#333333] text-left text-white font-semibold">
                            <th className="px-5 py-3 font-semibold">
                                Endpoint
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Status
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Severity
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Acknowledged
                            </th>

                            <th className="px-5 py-3 font-semibold">
                                Started At
                            </th>

                            <th className="px-5 py-3 font-semibold text-center">
                                Details
                            </th>

                            <th className="px-5 py-3 font-semibold text-center">
                                Endpoint
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {incidents.map((incident) => (
                            <tr
                                key={incident._id}
                                className="border-b border-[#333333] text-[#ededed] transition-colors hover:bg-[#222222]"
                            >
                                <td className="px-5 py-4">
                                    <Link
                                        to={`/endpoint/${incident.endpointId}`}
                                        className="break-all font-medium text-[#3794ff] hover:underline"
                                    >
                                        {incident.endpointId}
                                    </Link>
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${
                                            incident.status.toLowerCase() ===
                                            "resolved"
                                                ? "bg-[#123d35] text-[#4adebe]"
                                                : incident.status.toLowerCase() ===
                                                  "open"
                                                ? "bg-[#4b1f26] text-[#ff7b8b]"
                                                : "bg-[#4a3a12] text-[#facc15]"
                                        }`}
                                    >
                                        {incident.status}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${
                                            incident.aiAnalysis.severityLevel.toLowerCase() ===
                                            "critical"
                                                ? "bg-[#4b1f26] text-[#ff7b8b]"
                                                : incident.aiAnalysis.severityLevel.toLowerCase() ===
                                                  "high"
                                                ? "bg-[#4a2d12] text-[#fb923c]"
                                                : incident.aiAnalysis.severityLevel.toLowerCase() ===
                                                  "medium"
                                                ? "bg-[#4a3a12] text-[#facc15]"
                                                : "bg-[#123d35] text-[#4adebe]"
                                        }`}
                                    >
                                        {incident.aiAnalysis.severityLevel}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={`font-semibold ${
                                            incident.acknowledged
                                                ? "text-[#4adebe]"
                                                : "text-[#ff7b8b]"
                                        }`}
                                    >
                                        {incident.acknowledged ? "Yes" : "No"}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-[#a3a3a3]">
                                    {new Date(
                                        incident.startTime
                                    ).toLocaleString()}
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <Link
                                        to={`/incident/${incident._id}`}
                                        className="inline-block rounded-lg bg-[#16365f] px-4 py-2 text-[#3794ff] transition hover:bg-[#1d477d]"
                                    >
                                        View
                                    </Link>
                                </td>

                                <td className="px-5 py-4 text-center">
                                    <Link
                                        to={`/endpoint/${incident.endpointId}`}
                                        className="inline-block rounded-lg bg-[#262626] px-4 py-2 text-[#ededed] transition hover:bg-[#363636]"
                                    >
                                        Endpoint
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentTable;