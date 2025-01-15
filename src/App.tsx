import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MenuPage from "./pages/customer/MenuPage";
import KitchenDashboard from "./pages/restaurant/KitchenDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import { PublicRoute } from "./components/PublicRoute";
import { KitchenRoute } from "./components/KitchenRoute";
import { DeliveryRoute } from "./components/DeliveryRoute";
import Partner from "./pages/Partner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/menu" element={<MenuPage />} />
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
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;