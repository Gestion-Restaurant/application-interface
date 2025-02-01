import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import IDish from "@/types/dishInterface";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "@/services/auth.service";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    }),
});

interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

const ManageDishes = () => {
    const token = getAuthToken();
    const decodedToken = token ? jwtDecode<JWTPayload>(token) : null;
    const restaurantId = decodedToken?.id;
    
    const { toast } = useToast();
    const [dishes, setDishes] = useState<IDish[]>([
        {
            _id: "1",
            name: "Margherita Pizza",
            description: "Fresh tomatoes, mozzarella, and basil",
            price: 12.99,
            isAvailable: true,
            restaurantId: restaurantId,
        },
    ]);
    const [editingDish, setEditingDish] = useState<IDish | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (editingDish) {
            setDishes((prev) =>
                prev.map((dish) =>
                    dish._id === editingDish._id
                    ? {
                        ...dish,
                        name: values.name,
                        description: values.description,
                        price: Number(values.price),
                    }
                    : dish
                )
            );
            fetch(`http://localhost:8000/kitchen/dishes/${editingDish._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                }, // put in authorization headers the jwt stocked in cookies

                body: JSON.stringify({
                    name: values.name,
                    description: values.description,
                    price: Number(values.price),
                }),
            })
            toast({
                title: "Dish updated",
                description: "The dish has been successfully updated.",
            });
        } else {
            const newDish: IDish = {
                _id: Math.random().toString(36).substr(2, 9),
                name: values.name,
                description: values.description,
                price: Number(values.price),
                isAvailable: true,
                restaurantId: "1",
            };
            setDishes((prev) => [...prev, newDish]);
            toast({
                title: "Dish added",
                description: "The new dish has been successfully added.",
            });
        }
        form.reset();
        setEditingDish(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (dish: IDish) => {
        setEditingDish(dish);
        form.reset({
            name: dish.name,
            description: dish.description,
            price: dish.price.toString(),
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setDishes((prev) => prev.filter((dish) => dish._id !== id));
        toast({
            title: "Dish deleted",
            description: "The dish has been successfully removed.",
        });
    };

    const toggleAvailability = (id: string) => {
        setDishes((prev) =>
            prev.map((dish) =>
                dish._id === id ? { ...dish, isAvailable: !dish.isAvailable } : dish
            )
        );
        const dish = dishes.find((d) => d._id === id);
        toast({
            title: "Availability updated",
            description: `${dish?.name} is now ${
                dish?.isAvailable ? "unavailable" : "available"
            }`,
        });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Dishes</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setEditingDish(null);
                                form.reset();
                            }}
                            className="bg-primary hover:bg-primary/90"
                        >
                        <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Dish
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingDish ? "Edit Dish" : "Add New Dish"}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Dish name" {...field} />
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Dish description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    {editingDish ? "Update Dish" : "Add Dish"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dishes.map((dish) => (
                    <Card key={dish._id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span>{dish.name}</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(dish)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(dish._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{dish.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    ${dish.price.toFixed(2)}
                                </span>
                                <Button
                                    variant={dish.isAvailable ? "default" : "secondary"}
                                    onClick={() => toggleAvailability(dish._id)}
                                >
                                    {dish.isAvailable ? "Available" : "Unavailable"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageDishes;