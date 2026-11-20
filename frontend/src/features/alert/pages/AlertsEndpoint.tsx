import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import AlertsInfo from "../components/AlertsInfo";
import { useAlertsByEndpoint } from "../hooks/useAlertsByEndpoint";

const AlertsEndpoint = () => {
    const navigate = useNavigate();
    const { id: endpointId } = useParams<{ id: string }>();
    const { alerts, loading } = useAlertsByEndpoint(endpointId!);
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="space-y-8">

            <div>

                <h1 className="page-title">
                    Endpoint Alerts
                </h1>

                <p className="mt-2 text-gray-500">
                    Incident history of this endpoint
                </p>

                <button onClick={() => navigate(`/endpoint/${endpointId}`)} className="btn-primary mt-4">
                    Back to Endpoint
                </button>

            </div>

            <AlertsInfo alerts={alerts} />

        </div>
    );
}

export default AlertsEndpoint;