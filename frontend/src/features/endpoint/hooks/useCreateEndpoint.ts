import type { CreateEndpointPayload } from '../types';
import { createEndpoint } from '../api/endpoint.api';

export const useCreateEndpoint = () => {
    const createNewEndpoint = async (payload: CreateEndpointPayload) => {
        try {
            const newEndpoint = await createEndpoint(
                payload
            );
            return newEndpoint;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Endpoint creation failed due to error: ${errorMessage}`);
        }
    };

    return {
        createNewEndpoint,
    };
}