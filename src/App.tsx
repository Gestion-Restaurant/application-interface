import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import KitchenDashboard from "./pages/restaurant/KitchenDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import { PublicRoute } from "./components/PublicRoute";
import { KitchenRoute } from "./components/KitchenRoute";
import { DeliveryRoute } from "./components/DeliveryRoute";
import Partner from "./pages/Partner";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDishes from "./pages/RestaurantDishes";
import { CartProvider } from "./contexts/CartContext";
import ManageDishes from './pages/restaurant/ManageDishes';
import DeliveryTracking from "./pages/delivery/DeliveryTracking";
import { CustomerRoute } from "./components/CustomerRoute";
import DeliveryDetails from "./pages/delivery/DeliveryDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
              />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/restaurant/dashboard"
              element={
                <KitchenRoute>
                  <KitchenDashboard />
                </KitchenRoute>
              }
            />
            <Route
              path="/restaurant/dishes"
              element={
                <KitchenRoute>
                  <ManageDishes />
                </KitchenRoute>
              }
            />
            <Route
              path="/delivery/dashboard"
              element={
                <DeliveryRoute>
                  <DeliveryDashboard />
                </DeliveryRoute>
              }
            />
            <Route
              path="/partner"
              element={
                <PublicRoute>
                  <Partner />
                </PublicRoute>
              }
            />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id/dishes" element={<RestaurantDishes />} />
            <Route path="/delivery-tracking"
              element={
                <CustomerRoute>
                  <DeliveryTracking />
                </CustomerRoute>
              }
            />
            <Route path="/delivery-details"
              element={
                <DeliveryRoute>
                  <DeliveryDetails />
                </DeliveryRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;