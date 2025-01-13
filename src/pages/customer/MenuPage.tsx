import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Chicken Caesar Salad",
    description: "Grilled chicken with fresh romaine and caesar dressing",
    price: 9.99,
    category: "Salads",
    image: "/placeholder.svg"
  }
];

const MenuPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number }>>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const filteredItems = SAMPLE_MENU_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="card-hover">
            <CardHeader>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-4">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                <Button onClick={() => addToCart(item)}>Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shopping Cart Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.map(({ item, quantity }) => (
          <div key={item.id} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
            <p className="font-bold">${(item.price * quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="mt-auto">
          <Button className="w-full" disabled={cart.length === 0}>
            Checkout (${cart.reduce((total, { item, quantity }) => total + item.price * quantity, 0).toFixed(2)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;