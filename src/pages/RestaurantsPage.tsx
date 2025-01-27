import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - In a real app, this would come from an API
const restaurants = [
    {
        _id: "1",
        name: "Le Petit Bistro",
        description: "Authentic French cuisine in a cozy atmosphere",
        address: "123 Culinary Street",
        openingTime: "11:00",
        closingTime: "23:00",
    },
    {
        _id: "2",
        name: "Pasta Paradise",
        description: "Fresh Italian pasta made daily",
        address: "456 Foodie Avenue",
        openingTime: "12:00",
        closingTime: "22:00",
    },
    {
        _id: "3",
        name: "Sushi Master",
        description: "Premium sushi and Japanese delicacies",
        address: "789 Gourmet Boulevard",
        openingTime: "11:30",
        closingTime: "22:30",
    },
];

const RestaurantsPage = () => {
    const navigate = useNavigate();

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
};

export default RestaurantsPage;