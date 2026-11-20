import { useNavigate, useParams, Link } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import EndpointInfo from "../component/EndpointInfo";
import { useDeleteEndpoint } from "../hooks/useDeleteEndpoint";
import { useEndpoint } from "../hooks/useEndpoint";

const Endpoint = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { endpoint, loading } = useEndpoint(id!);
    const { deleteEndpointHook } = useDeleteEndpoint();

    const handleDelete = async () => {
        if (!endpoint || !window.confirm("Are you sure you want to delete this endpoint?")) {
            return;
        }

        const deleted = await deleteEndpointHook(endpoint._id);
        if (deleted) {
            navigate("/");
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!endpoint) {
        return (
            <div className="card py-12 text-center">

                <h2 className="text-2xl font-semibold">
                    Endpoint Not Found
                </h2>

                <p className="mt-3 text-gray-500">
                    This endpoint may have been deleted.
                </p>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>

                <h1 className="page-title">
                    Endpoint Details
                </h1>

                <p className="mt-2 text-gray-500">
                    View configuration and latest monitoring status.
                </p>

            </div>

            <EndpointInfo endpoint={endpoint} />

            <div className="flex flex-wrap gap-4">
                <Link to={`/endpoint/${endpoint._id}/edit`} className="btn-primary">
                    Edit Endpoint
                </Link>
                <button type="button" onClick={handleDelete} className="btn-danger">
                    Delete Endpoint
                </button>
            </div>

        </div>
    );
};

export default Endpoint;