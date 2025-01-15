import { Navigate } from "react-router-dom";
import { isAuthenticated, isClient } from "../services/auth.service";

export const ClientRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated() || !isClient) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};