import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            DeliveryApp
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/restaurants">Restaurants</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/orders">Orders</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/partner">Partner with Us</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;