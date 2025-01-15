import { Navigate } from "react-router-dom";
import { isAuthenticated, isDelivery } from "../services/auth.service";

export const DeliveryRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated() || !isDelivery()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};