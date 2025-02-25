import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { CheckoutDialog } from "./CheckoutDialog";
import { environment } from "@/environment/environment";
import { getAuthToken } from "@/services/auth.service";
import JWTPayload from "@/types/JWTPayload";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/components/ui/use-toast";

export const Cart = ({ restaurantId }: { restaurantId: string }) => {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const { toast } = useToast();
    const token = getAuthToken();
    const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
    const clientId = decodedToken?.id;

    const checkOut = async () => {
        try {
            const response = await fetch(
                `${environment.apiEndpoint}/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        clientId,
                        restaurantId,
                        items,
                        totalAmount: total,
                    }),
                }
            );
            if (!response.ok) {
                console.error("Failed to create order");
                toast({
                    title: "Error",
                    description: "Failed to create order",
                    variant: "destructive",
                });
                throw new Error("Failed to create order");
            }
            toast({
                title: "Order created",
                description: "Your order has been created successfully"
            });
            clearCart();
            window.location.href = "/#/delivery-tracking";
    } catch (error) {
            console.error("Error creating order:", error);
            toast({
                title: "Error",
                description: "Failed to create order",
                variant: "destructive",
            });
        }
    };
    
    const handleCheckoutSuccess = async () => {
        await checkOut();
    };

    if (items.length === 0) {
        return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Your cart is empty</p>
            </CardContent>
        </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {items.map((item) => (
                        <div
                            key={item.itemId}
                            className="flex items-center justify-between space-x-4"
                        >
                            <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.itemId, Math.max(0, item.quantity - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeFromCart(item.itemId)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                        </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
                <Button 
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    onClick={() => setCheckoutOpen(true)}
                >
                    Checkout
                </Button>
            </CardFooter>
            <CheckoutDialog
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                total={total}
                onSuccess={handleCheckoutSuccess}
            />
        </Card>
    );
};