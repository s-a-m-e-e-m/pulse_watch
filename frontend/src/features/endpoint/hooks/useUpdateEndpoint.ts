import { updateEndpoint } from "../api/endpoint.api";
import type { CreateEndpointPayload } from "../types";

export const useUpdateEndpoint = () => {
    const updateEndpointHook = async (
        id: string,
        payload: CreateEndpointPayload
    ) => {
        try {
            const updatedEndpointRes = await updateEndpoint(id, payload);
            return updatedEndpointRes;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(`Endpoint update failed due to error: ${errorMessage}`);
        }
    };

    return {
        updateEndpointHook,
    };
}