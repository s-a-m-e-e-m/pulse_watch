import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import EndpointForm from "../component/EndpointForm";
import { useEndpoint } from "../hooks/useEndpoint";

const EditEndpoint = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { endpoint, loading } = useEndpoint(id!);

    if (loading) {
        return <Loader />;
    }

    if (!endpoint) {
        return (
            <div className="card py-12 text-center">
                <h2 className="text-2xl font-semibold">Endpoint Not Found</h2>
                <p className="mt-3 text-gray-500">
                    This endpoint may have been deleted.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Edit Endpoint</h1>
                <p className="mt-2 text-gray-500">
                    Update the endpoint configuration and monitoring settings.
                </p>
            </div>

            <EndpointForm
                endpoint={endpoint}
                onSuccess={(updatedEndpoint) =>
                    navigate(`/endpoint/${updatedEndpoint._id}`)
                }
            />
        </div>
    );
};

export default EditEndpoint;
