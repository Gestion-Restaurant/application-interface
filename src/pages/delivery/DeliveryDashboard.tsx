import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DeliveryStatus } from "@/types/deliveryStatusEnum";
import { environment } from "@/environment/environment";

interface DeliveryOrder {
  _id: string;
  clientId: string;
  deliveryPersonId: string;
  address: string;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
}

const SAMPLE_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    _id: "1",
    address: "123 Main St, City",
    status: DeliveryStatus.READY_FOR_DELIVERY,
    createdAt: new Date(),
    updatedAt: new Date(),
    clientId: "1",
    deliveryPersonId: "1",
    orderId: "1"
  }
];

const DeliveryDashboard = () => {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);

  const updateDeliveryStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery._id === orderId ? { ...delivery, status: newStatus } : delivery
      )
    );

    toast({
      title: "Delivery Updated",
      description: `Order #${orderId} status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch(`${environment.apiEndpoint}/delivery`,
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch deliveries");
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error("Error fetching deliveries", error);
      }
    };

    fetchDeliveries();

    const interfalId = setInterval(fetchDeliveries, 5000);

    return () => clearInterval(interfalId);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>
      
      <div className="grid gap-6">
        {deliveries.map((delivery) => (
          <Card key={delivery.orderId}>
            <CardHeader>
              <CardTitle>Order #{delivery.orderId.substring(delivery.orderId.length-4, delivery.orderId.length)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">{delivery.address}</p>
                  <p className="text-sm text-gray-600">
                    Ordered at: {new Date(delivery.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {delivery.status === DeliveryStatus.READY_FOR_DELIVERY && (
                    <Button onClick={() => updateDeliveryStatus(delivery.orderId, DeliveryStatus.ASSIGNED)}>
                      Assign to me
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