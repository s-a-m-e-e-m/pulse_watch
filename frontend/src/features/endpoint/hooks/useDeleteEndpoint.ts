import { deleteEndpoint } from "../api/endpoint.api";

export const useDeleteEndpoint = () => {
    const deleteEndpointHook = async (id: string): Promise<boolean> => {
        try {
            await deleteEndpoint(id);
            alert("Endpoint deleted successfully");
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error(`Error deleting endpoint: ${errorMessage}`);
            return false;
        }
    }

    return {
        deleteEndpointHook,
    };
}