import { Link } from "react-router-dom";
import { FaEye, FaHistory } from "react-icons/fa";
import type { Endpoint } from "../types";

const EndpointTable = ({ endpoints }: { endpoints: Endpoint[] }) => {

    if (endpoints.length === 0) {
        return (
            <div className="card bg-[#0a0a0a] py-12 text-center text-[#ededed]">
                <h2 className="text-xl font-semibold text-[#ededed]">
                    No Endpoints Found
                </h2>

                <p className="mt-2 text-[#888]">
                    Create your first endpoint to start monitoring APIs.
                </p>

                <Link
                    to="/create-endpoint"
                    className="btn-success mt-6 inline-block">
                    Create Endpoint
                </Link>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden border border-[#333333]">

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Endpoints
                </h2>

                <span className="rounded-full bg-[#16365f] px-3 py-1 text-sm font-medium text-[#3794ff]">
                    {endpoints.length} APIs
                </span>
            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full border-collapse bg-[#161616] text-[#ededed]">

                    <thead>

                        <tr className="border-b border-[#333333] bg-[#161616] text-white font-semibold">

                            <th className="px-4 py-3 text-left">
                                Name
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status Code
                            </th>

                            <th className="px-4 py-3 text-left">
                                Latency
                            </th>

                            <th className="px-4 py-3 text-center">
                                Details
                            </th>

                            <th className="px-4 py-3 text-center">
                                Logs
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {endpoints.map((endpoint) => (

                            <tr
                                key={endpoint._id}
                                className="border-b border-[#333333] transition-colors hover:bg-[#222222]">

                                <td className="px-4 py-4 font-medium">
                                    {endpoint.name}
                                </td>

                                <td className="px-4 py-4">

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                                            endpoint.latestStatus === "UP"
                                                ? "bg-[#123d35] text-[#4adebe]"
                                                : "bg-[#4b1f26] text-[#ff7b8b]"
                                        }`}>
                                        {endpoint.latestStatus}
                                    </span>

                                </td>

                                <td className="px-4 py-4">
                                    {endpoint.lastStatusCode}
                                </td>

                                <td className="px-4 py-4">
                                    {endpoint.latestLatency} ms
                                </td>

                                <td className="px-4 py-4 text-center">

                                    <Link
                                        to={`/endpoint/${endpoint._id}`}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#16365f] px-3 py-2 text-[#3e95f0] transition hover:bg-[#1d477d]">
                                        <FaEye />
                                        View
                                    </Link>

                                </td>

                                <td className="px-4 py-4 text-center">

                                    <Link
                                        to={`/healthlogs/${endpoint._id}`}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#262626] px-3 py-2 text-[#ededed] transition hover:bg-[#363636]">
                                        <FaHistory />
                                        Logs
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

export default EndpointTable;