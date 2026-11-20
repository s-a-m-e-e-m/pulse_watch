import { useEffect, useState } from "react";
import { useCreateEndpoint } from "../hooks/useCreateEndpoint";
import { useUpdateEndpoint } from "../hooks/useUpdateEndpoint";
import type { CreateEndpointPayload, Endpoint } from "../types";
import { useNavigate } from "react-router-dom";

interface EndpointFormProps {
    endpoint?: Endpoint;
    onSuccess?: (endpoint: Endpoint) => void;
}

const EndpointForm = ({ endpoint, onSuccess }: EndpointFormProps) => {
    const navigate = useNavigate();
    const isEditing = Boolean(endpoint);
    const [name, setName] = useState(endpoint?.name ?? "");
    const [url, setUrl] = useState(endpoint?.url ?? "");
    const [method, setMethod] = useState(endpoint?.method ?? "GET");
    const [expectedStatus, setExpectedStatus] = useState(endpoint?.expectedStatus ?? 200);
    const [expectedResponse, setExpectedResponse] = useState(endpoint?.expectedResponse ?? "");
    const [headersText, setHeadersText] = useState(
        endpoint ? JSON.stringify(endpoint.headers, null, 2) : "{}"
    );
    const [bodyText, setBodyText] = useState(
        endpoint?.body ? JSON.stringify(endpoint.body, null, 2) : ""
    );
    const [timeout, setTimeout] = useState(endpoint?.timeout ?? 5000);
    const [frequency, setFrequency] = useState(endpoint?.frequency ?? 60);
    const [enabled, setEnabled] = useState(endpoint?.enabled ?? true);

    const [loading, setLoading] = useState(false);

    const { createNewEndpoint } = useCreateEndpoint();
    const { updateEndpointHook } = useUpdateEndpoint();

    useEffect(() => {
        if (!endpoint) {
            return;
        }

        setName(endpoint.name);
        setUrl(endpoint.url);
        setMethod(endpoint.method);
        setExpectedStatus(endpoint.expectedStatus);
        setExpectedResponse(endpoint.expectedResponse ?? "");
        setHeadersText(JSON.stringify(endpoint.headers, null, 2));
        setBodyText(endpoint.body ? JSON.stringify(endpoint.body, null, 2) : "");
        setTimeout(endpoint.timeout);
        setFrequency(endpoint.frequency);
        setEnabled(endpoint.enabled);
    }, [endpoint]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        let headers = {};
        let body = null;
        try {
            headers = headersText.trim() ? JSON.parse(headersText) : {};
            body = bodyText.trim() ? JSON.parse(bodyText) : null;
        } catch {
            alert("Invalid JSON in Headers or Body");
            setLoading(false);
            return;
        }

        const payload: CreateEndpointPayload = {
            name,
            url,
            method,
            expectedStatus,
            expectedResponse,
            headers,
            body,
            timeout,
            frequency,
            enabled,
        };

        const savedEndpoint = isEditing && endpoint
            ? await updateEndpointHook(endpoint._id, payload)
            : await createNewEndpoint(payload);

        setLoading(false);
        if (savedEndpoint) {
            navigate(`/endpoint/${savedEndpoint._id}`);
            onSuccess?.(savedEndpoint);
        }
    };

    return (
        <div className="card max-w-4xl">

            <h2 className="page-title mb-2">
                {isEditing ? "Edit Endpoint" : "Create New Endpoint"}
            </h2>

            <p className="mb-8 text-gray-500">
                Configure an API endpoint for continuous monitoring.
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <label className="label">
                            Endpoint Name
                        </label>

                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="User Service"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            Method
                        </label>

                        <select
                            className="input"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>PATCH</option>
                            <option>DELETE</option>
                            <option>HEAD</option>
                            <option>OPTIONS</option>
                        </select>
                    </div>

                </div>

                <div>

                    <label className="label">
                        Endpoint URL
                    </label>

                    <input
                        className="input"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://api.example.com/users"
                        required
                    />

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    <div>

                        <label className="label">
                            Expected Status
                        </label>

                        <input
                            className="input"
                            type="number"
                            value={expectedStatus}
                            onChange={(e) =>
                                setExpectedStatus(Number(e.target.value))
                            }
                        />

                    </div>

                    <div>

                        <label className="label">
                            Timeout (ms)
                        </label>

                        <input
                            className="input"
                            type="number"
                            value={timeout}
                            onChange={(e) =>
                                setTimeout(Number(e.target.value))
                            }
                        />

                    </div>

                </div>

                <div>

                    <label className="label">
                        Expected Response
                    </label>

                    <textarea
                        className="textarea"
                        rows={4}
                        value={expectedResponse}
                        onChange={(e) =>
                            setExpectedResponse(e.target.value)
                        }
                    />

                </div>

                <div>

                    <label className="label">
                        Headers (JSON)
                    </label>

                    <textarea
                        className="textarea font-mono"
                        rows={5}
                        value={headersText}
                        onChange={(e) =>
                            setHeadersText(e.target.value)
                        }
                        placeholder={`{\n  "Content-Type": "application/json"\n}`}
                    />

                </div>

                <div>

                    <label className="label">
                        Body (JSON)
                    </label>

                    <textarea
                        className="textarea font-mono"
                        rows={6}
                        value={bodyText}
                        onChange={(e) =>
                            setBodyText(e.target.value)
                        }
                        placeholder={`{\n  "username": "john"\n}`}
                    />

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    <div>

                        <label className="label">
                            Frequency (seconds)
                        </label>

                        <input
                            className="input"
                            type="number"
                            value={frequency}
                            onChange={(e) =>
                                setFrequency(Number(e.target.value))
                            }
                        />

                    </div>

                    <div className="flex items-end">

                        <label className="flex items-center gap-3 font-medium">

                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) =>
                                    setEnabled(e.target.checked)
                                }
                            />

                            Enable Monitoring

                        </label>

                    </div>

                </div>

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="btn-success"
                        disabled={loading}
                    >
                      {loading
                          ? isEditing ? "Updating..." : "Creating..."
                          : isEditing ? "Update Endpoint" : "Create Endpoint"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default EndpointForm;