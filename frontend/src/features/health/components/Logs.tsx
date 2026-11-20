import type { HealthLog } from "../types";

function getFormattedJson(responseBody: string): string {
    if (!responseBody || !responseBody.trim()) return "";

    try {
        const parsed = JSON.parse(responseBody);
        // Pretty-prints the JSON with 2-space indentation
        return JSON.stringify(parsed, null, 2);
    } catch {
        // Return original string if it wasn't JSON (e.g., HTML or plain text)
        return responseBody;
    }
}

const Logs = ({ healthLogs }: { healthLogs: HealthLog[] }) => {

    if (!healthLogs || healthLogs.length === 0) {
        return <p>No health logs available.</p>;
    }

    return (

        <div className="card overflow-hidden border border-[#333333] bg-[#161616] text-[#ededed]">

            <div className="flex items-center justify-between mb-5">

                <h2 className="section-title">
                    Health History
                </h2>

                <span className="text-sm text-[#888]">
                    {healthLogs.length} Logs
                </span>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full table-fixed border-collapse bg-[#161616]">

                    <thead className="bg-[#161616] text-[#a3a3a3]">

                        <tr className="border-b border-[#333333] text-white font-semibold">

                            <th className="px-4 py-3 text-left">Status</th>

                            <th className="px-4 py-3 text-left">Status Code</th>

                            <th className="px-4 py-3 text-left">Latency (ms)</th>

                            <th className="w-[30%] px-4 py-3 text-left">Response Body</th>

                            <th className="px-4 py-3 text-left">Checked At</th>

                        </tr>

                    </thead>

                    <tbody>

                        {healthLogs.map((log) => (
                            <tr key={log._id} className="health-log-row border-b border-[#333333] transition-colors hover:bg-[#222222]">

                                <td className="px-4 py-3">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${log.status === "UP"
                                            ? "bg-[#123d35] text-[#4adebe]"
                                            : "bg-[#4b1f26] text-[#ff7b8b]"
                                            }`}
                                    >

                                        {log.status}

                                    </span>

                                </td>

                                <td className="px-4 py-3"><span
                                    className={`font-semibold ${log.statusCode >= 500
                                        ? "text-[#ff7b8b]"
                                        : "text-[#4adebe]"
                                        }`}
                                >{log.statusCode}</span></td>

                                <td className="px-4 py-3"><span
                                    className={`font-semibold ${log.latency > 1000
                                        ? "text-[#ff7b8b]"
                                        : log.latency > 300
                                            ? "text-[#facc15]"
                                            : "text-[#4adebe]"
                                        }`}
                                >{log.latency} ms</span></td>

                                <td className="w-[30%] max-w-0 px-4 py-3">
                                    <details className="w-full">

                                    <summary className="cursor-pointer text-[#3794ff]">

                                        View Response

                                    </summary>

                                    <pre className="mt-3 max-h-72 max-w-full overflow-auto whitespace-pre-wrap break-words rounded bg-[#171717] p-3 text-xs text-[#a3a3a3]">

                                        {getFormattedJson(log.responseBody)}

                                    </pre>

                                    </details>
                                </td>

                                <td className="px-4 py-3">{new Date(log.checkedAt).toLocaleString()}</td>

                            </tr>
                        ))}

                    </tbody>

                </table>
                
            </div>

        </div>
    )
}

export default Logs;