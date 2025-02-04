import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DeliveryStatus } from "@/types/deliveryStatusEnum";
import { environment } from "@/environment/environment";
import { getAuthToken } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import JWTPayload from "@/types/JWTPayload";

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

const DeliveryDashboard = () => {

  const token = getAuthToken();
  const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
  const userId = decodedToken?.id;

  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);

  const updateDeliveryStatusApi = async (orderId: string, newStatus: DeliveryOrder["status"]) => {
    fetch(`${environment.apiEndpoint}/delivery/assign/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deliveryPersonId: userId
      }),
    }).then((response) => {
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to update delivery status",
          variant: "destructive"
        });

        throw new Error("Failed to update delivery status");
      }

      window.location.href = '/#/delivery-details/';
    });
  }

  const updateDeliveryStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    console.log(orderId);
    updateDeliveryStatusApi(orderId, newStatus);
  };

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

  const verifyAssigned = async () => {
    try {
      const response = await fetch(`${environment.apiEndpoint}/delivery/deliveryPerson/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": getAuthToken() || ''
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch assigned deliveries');
      const data = await response.json();
      if (data.length > 0) {
        window.location.href = '/#/delivery-details/';
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    verifyAssigned();

    fetchDeliveries();

    const interfalId = setInterval(fetchDeliveries, 5000);

    return () => clearInterval(interfalId);
  });

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