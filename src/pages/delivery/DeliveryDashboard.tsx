import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeliveryOrder {
  id: string;
  customerName: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  status: "ready" | "picked_up" | "delivering" | "delivered";
  orderTime: string;
}

const SAMPLE_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: "1",
    customerName: "John Doe",
    address: "123 Main St, City",
    items: [
      { name: "Margherita Pizza", quantity: 2 },
      { name: "Caesar Salad", quantity: 1 }
    ],
    status: "ready",
    orderTime: "2024-02-20T10:30:00"
  }
];

const DeliveryDashboard = () => {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(SAMPLE_DELIVERY_ORDERS);

  const updateDeliveryStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === orderId ? { ...delivery, status: newStatus } : delivery
      )
    );

    toast({
      title: "Delivery Updated",
      description: `Order #${orderId} status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>
      
      <div className="grid gap-6">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader>
              <CardTitle>Order #{delivery.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Customer: {delivery.customerName}</p>
                  <p className="text-gray-600">{delivery.address}</p>
                  <p className="text-sm text-gray-600">
                    Ordered at: {new Date(delivery.orderTime).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {delivery.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  {delivery.status === "ready" && (
                    <Button onClick={() => updateDeliveryStatus(delivery.id, "picked_up")}>
                      Pick Up Order
                    </Button>
                  )}
                  {delivery.status === "picked_up" && (
                    <Button onClick={() => updateDeliveryStatus(delivery.id, "delivering")}>
                      Start Delivery
                    </Button>
                  )}
                  {delivery.status === "delivering" && (
                    <Button onClick={() => updateDeliveryStatus(delivery.id, "delivered")}>
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard;