import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Truck, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Food Delivery Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect restaurants, customers, and delivery partners in one seamless platform
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link to="/restaurants" className="button-primary">
                  Browse Restaurants
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/partner">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center card-hover">
              <Package className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Order Food</h3>
              <p className="text-gray-600">
                Browse local restaurants and order your favorite meals
              </p>
            </Card>
            <Card className="p-6 text-center card-hover">
              <Truck className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Track Delivery</h3>
              <p className="text-gray-600">
                Real-time tracking of your order from restaurant to doorstep
              </p>
            </Card>
            <Card className="p-6 text-center card-hover">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">Join Us</h3>
              <p className="text-gray-600">
                Partner with us as a restaurant or delivery partner
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;