import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth.service";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated()) {
        return <Navigate to="/#" replace />;
    }
    return <>{children}</>;
};