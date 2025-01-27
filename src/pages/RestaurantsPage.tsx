import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IUser from "@/types/userInterface";

const RestaurantsPage = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const REACT_APP_API_BASE_URL = "http://localhost:8000";

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(`${REACT_APP_API_BASE_URL}/customers/chef`);

                if (!response.ok) {
                    throw new Error('Failed to fetch restaurants');
                }

                const data = await response.json();
                setRestaurants(data.customers || []);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);
    
    if (isLoading) {
        return <div>Loading restaurants...</div>;
    } else {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="page-header">Our Restaurants</h1>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                        <Card 
                        key={restaurant._id}
                        className="card-container cursor-pointer group"
                        onClick={() => navigate(`/restaurants/${restaurant._id}/dishes`)}
                        >
                            <CardHeader>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {restaurant.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                {restaurant.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4 text-secondary" />
                                    <span>{restaurant.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-4 w-4 text-secondary" />
                                    <span>
                                    {restaurant.openingTime} - {restaurant.closingTime}
                                    </span>
                                </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>
            </div>
        );
    }
};

export default RestaurantsPage;