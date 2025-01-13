import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  status: "pending" | "preparing" | "ready" | "delivered";
  customerName: string;
  orderTime: string;
  priority: boolean;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "1",
    items: [
      { name: "Margherita Pizza", quantity: 2 },
      { name: "Caesar Salad", quantity: 1 }
    ],
    status: "pending",
    customerName: "John Doe",
    orderTime: "2024-02-20T10:30:00",
    priority: false
  }
];

const KitchenDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    toast({
      title: "Order Updated",
      description: `Order #${orderId} status changed to ${newStatus}`
    });
  };

  const togglePriority = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, priority: !order.priority } : order
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kitchen Dashboard</h1>
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className={`${order.priority ? 'border-red-500 border-2' : ''}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id}</span>
                <Button
                  variant={order.priority ? "destructive" : "outline"}
                  onClick={() => togglePriority(order.id)}
                >
                  {order.priority ? "High Priority" : "Set Priority"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Customer: {order.customerName}</p>
                  <p className="text-sm text-gray-600">
                    Ordered at: {new Date(order.orderTime).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    disabled={order.status !== "pending"}
                  >
                    Start Preparing
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    disabled={order.status !== "preparing"}
                  >
                    Mark as Ready
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