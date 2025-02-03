import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const KitchenDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const token = getAuthToken();
  const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
  const restaurantId = decodedToken?.id;

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updateOrderStatus = async () => {
      fetch(`${environment.apiEndpoint}/orders/byId/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }).then((response) => {
        if (!response.ok) {
          toast({
            title: "Error",
            description: "Failed to update order status",
            variant: "destructive"
          });

          throw new Error("Failed to update order status");
        }

        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
    
        toast({
          title: "Order Updated",
          description: `Order #${orderId.substring(orderId.length-4, orderId.length)} status changed to ${newStatus}`
        });
        return response.json();
      });
    };
    
    updateOrderStatus();
  };

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${environment.apiEndpoint}/orders/restaurant/${restaurantId}`,
                {
                    headers: {
                        'Authorization': getAuthToken() || ''
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            console.log(data.data);
            setOrders(data.data.length > 0 ? data.data.sort((a: Order, b: Order) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ) : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast({
                title: "Error",
                description: "Failed to fetch orders",
                variant: "destructive"
            });
        }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 3000);

    return () => clearInterval(intervalId);
}, [restaurantId, toast]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kitchen Dashboard</h1>
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order._id} className={`${order.priority ? 'border-red-500 border-2' : ''}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order._id.substring(order._id.length-4, order._id.length)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-600">
                    Ordered at: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={`${order._id}-${item.name}`}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateOrderStatus(order._id, DeliveryStatus.IN_KITCHEN)}
                    disabled={order.status !== "pending"}
                  >
                    Start Preparing
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order._id, DeliveryStatus.READY_FOR_DELIVERY)}
                    disabled={order.status !== DeliveryStatus.IN_KITCHEN}
                  >
                    Mark as Ready
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order._id, DeliveryStatus.IN_TRANSIT)}
                    disabled={order.status !== DeliveryStatus.ASSIGNED}
                  >
                    Mark as Picked up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;