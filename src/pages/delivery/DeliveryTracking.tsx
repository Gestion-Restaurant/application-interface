import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Truck, User, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryStatus {
  status: "preparing" | "picked_up" | "on_the_way" | "delivered";
  timestamp: string;
}

interface DeliveryDetails {
  id: string;
  status: DeliveryStatus;
  deliveryGuy: {
    name: string;
    phone: string;
    rating: number;
  };
  estimatedDeliveryTime: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

// Sample data - in a real app, this would come from an API
const sampleDelivery: DeliveryDetails = {
  id: "DEL123",
  status: {
    status: "on_the_way",
    timestamp: new Date().toISOString(),
  },
  deliveryGuy: {
    name: "John Doe",
    phone: "+1 234 567 8900",
    rating: 4.8,
  },
  estimatedDeliveryTime: "2024-02-21T15:30:00",
  address: "123 Main St, Anytown, CA 12345",
  items: [
    { name: "Margherita Pizza", quantity: 2 },
    { name: "Garlic Bread", quantity: 1 },
  ],
};

const DeliveryTracking = () => {
  const [delivery] = useState<DeliveryDetails>(sampleDelivery);
  const { toast } = useToast();

  const getStatusColor = (status: DeliveryStatus["status"]) => {
    switch (status) {
      case "preparing":
        return "text-yellow-500";
      case "picked_up":
        return "text-blue-500";
      case "on_the_way":
        return "text-purple-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Tracking</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className={getStatusColor(delivery.status.status)} />
              Order #{delivery.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold">Estimated Delivery Time</p>
                <p>{new Date(delivery.estimatedDeliveryTime).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold">Delivery Address</p>
                <p>{delivery.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold">Delivery Partner</p>
                <p>{delivery.deliveryGuy.name}</p>
                <p className="text-sm text-gray-600">Rating: {delivery.deliveryGuy.rating} ⭐</p>
                <p className="text-sm text-gray-600">{delivery.deliveryGuy.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items:</h3>
              <ul className="space-y-2">
                {delivery.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className={getStatusColor(delivery.status.status)} />
                <span className="font-semibold capitalize">
                  Status: {delivery.status.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date(delivery.status.timestamp).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTracking;