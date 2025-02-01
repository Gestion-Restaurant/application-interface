import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { Check, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";
import { useToast } from "@/components/ui/use-toast";
import IDish from "@/types/dishInterface";

// Mock data - In a real app, this would be filtered by restaurantId from an API

const RestaurantDishes = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [dishes, setDishes] = useState<IDish[]>([]);
    const filteredDishes = dishes.filter(dish => dish.restaurantId === id);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const updateQuantity = (dishId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [dishId]: Math.max(0, (prev[dishId] || 0) + delta)
        }));
    };

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch(`http://localhost:8000/kitchen/dishes/restaurant/${id}`);
    
                if (!response.ok) {
                    throw new Error('Failed to fetch dishes');
                }
    
                const data = await response.json();
                setDishes(data.dishes || []);
            } catch (error) {
                console.error('Error fetching dishes:', error);
            }
        };
    
        fetchDishes();
    }, [id]);

    const handleAddToCart = (dish: typeof dishes[0]) => {
        const quantity = quantities[dish._id] || 0;
        if (quantity > 0) {
            addToCart({
                id: dish._id,
                name: dish.name,
                price: dish.price,
                restaurantId: dish.restaurantId
            }, quantity);
            setQuantities(prev => ({ ...prev, [dish._id]: 0 }));
            toast({
                title: "Added to cart",
                description: `${quantity}x ${dish.name} added to your cart`,
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Menu
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredDishes.map((dish) => (
                                <Card key={dish._id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {dish.name}
                                            </CardTitle>
                                            {dish.isAvailable ? (
                                                <Check className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                        <CardDescription className="text-gray-600">
                                            {dish.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                                ${dish.price.toFixed(2)}
                                            </div>
                                            {dish.isAvailable && (
                                                <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(dish._id, -1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">
                                                    {quantities[dish._id] || 0}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(dish._id, 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                                    onClick={() => handleAddToCart(dish)}
                                                    disabled={!quantities[dish._id]}
                                                >
                                                    Add to Cart
                                                </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="lg:col-span-1">
                    <Cart />
                </div>
            </div>
        </div>
    );
};

export default RestaurantDishes;