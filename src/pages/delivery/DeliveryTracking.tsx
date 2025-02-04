import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Truck, User, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeliveryStatus } from "@/types/deliveryStatusEnum";
import { environment } from "@/environment/environment";
import { getAuthToken } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import JWTPayload from "@/types/JWTPayload";

interface Order {
  _id: string;
  clientId: string;
  restaurantId: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  status: DeliveryStatus;
  customerName: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  priority: boolean;
}

const DeliveryTracking = () => {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order>();
  const token = getAuthToken();
  const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
  const userId = decodedToken?.id;

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.IN_KITCHEN:
      case DeliveryStatus.READY_FOR_DELIVERY:
        return "text-yellow-500";
      case DeliveryStatus.ASSIGNED:
        return "text-blue-500";
      case DeliveryStatus.IN_TRANSIT:
        return "text-purple-500";
      case DeliveryStatus.DELIVERED:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${environment.apiEndpoint}/orders/ByIdClient/${userId}`,
        {
          headers: {
            'Authorization': token
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrder(data.data.length > 0 ? data.data[0] : null);
      if (data.data.length === 0) {
        window.location.href = "/#/restaurants";
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return ( order &&
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Tracking</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className={getStatusColor(order.status)} />
              Order #{order._id.substring(order._id.length-4, order._id.length)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="w-5 h-5 mt-1" />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items:</h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity}x {item.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className={getStatusColor(order.status)} />
                <span className="font-semibold capitalize">
                  Status: {order.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTracking;