import { Navigate } from "react-router-dom";
import { isAuthenticated, isRestaurant } from "../services/auth.service";

export const KitchenRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated() || !isRestaurant()) {
        return <Navigate to="/#" replace />;
    }
    return <>{children}</>;
};