import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeliveryStatus } from "@/types/deliveryStatusEnum";
import { environment } from "@/environment/environment";
import { getAuthToken } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import JWTPayload from "@/types/JWTPayload";

interface DeliveryDetails {
    _id: string;
    orderId: string;
    customerName: string;
    address: string;
    status: DeliveryStatus;
    createdAt: Date;
    updatedAt: Date;
}

const DeliveryDetails = () => {

    const [delivery, setDelivery] = useState<DeliveryDetails>();
    const { toast } = useToast();

    const updateStatus = (newStatus: DeliveryDetails["status"]) => {
        fetch(`${environment.apiEndpoint}/orders/byId/${delivery.orderId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        }).then(response => {
            if (!response.ok) throw new Error('Failed to update delivery status');
            return response.json();
        }).then(data => {
            setDelivery(data);
            toast({
                title: "Status Updated",
                description: `Delivery status changed to ${newStatus.replace('_', ' ')}`
            });
            setDelivery(prev => ({ ...prev, status: newStatus }));
            window.location.href = "/delivery/dashboard";
        }).catch(error => {
            toast({
                title: "Error",
                description: error.message,
            });
        });
    };

    const fetchDeliveryByDeliveryGuyId = async () => {
        const token = getAuthToken();
        const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
        const userId = decodedToken?.id;
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

        setDelivery(data[0]);
    }

    const getNextStatus = () => {
        if (delivery.status === DeliveryStatus.IN_TRANSIT) {
            return DeliveryStatus.DELIVERED;
        }
        return null;
    };

    useEffect(() => {
        fetchDeliveryByDeliveryGuyId();

        const interfalId = setInterval(fetchDeliveryByDeliveryGuyId, 5000);

        return () => clearInterval(interfalId)

    }, []);

    return ( delivery &&
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Delivery Details</h1>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            Order #{delivery.orderId.substring(delivery.orderId.length - 4, delivery.orderId.length)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-2">
                            <User className="w-5 h-5 mt-1" />
                            <div>
                                <p className="font-semibold">Customer Details</p>
                                <p>{delivery.customerName}</p>
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
                            <Clock className="w-5 h-5 mt-1" />
                            <div>
                                <p className="font-semibold">Order Time</p>
                                <p>{new Date(delivery.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="font-semibold mb-2">
                                Current Status: <span className="capitalize">{delivery.status.replace('_', ' ')}</span>
                            </p>
                            {getNextStatus() && (
                                <Button 
                                    className="w-full"
                                    disabled={delivery.status !== DeliveryStatus.IN_TRANSIT}
                                    onClick={() => updateStatus(DeliveryStatus.DELIVERED)}
                                >
                                    Mark as {getNextStatus()?.replace('_', ' ')}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeliveryDetails;