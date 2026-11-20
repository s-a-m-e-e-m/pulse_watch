import api from "../../../services/api";
import type { Endpoint, CreateEndpointPayload } from "../types";

interface EndpointResponse {
    endpoint: Endpoint;
}

export const getEndpointById = async (id: string): Promise<Endpoint> => {
    const res = await api.get<EndpointResponse>(`/endpoints/${id}`);
    return res.data.endpoint;
}

export const createEndpoint = async (
    payload: CreateEndpointPayload
): Promise<Endpoint> => {
    const res = await api.post<EndpointResponse>(
        '/endpoints/create', 
        payload
    );
    return res.data.endpoint;
}

export const updateEndpoint = async (
    id: string,
    payload: CreateEndpointPayload
): Promise<Endpoint> => {
    const res = await api.put<EndpointResponse>(
        `/endpoints/edit/${id}`,
        payload
    );

    return res.data.endpoint;
}

export const deleteEndpoint = async (id: string): Promise<void> => {
    await api.delete(`/endpoints/${id}`);
    return;
}