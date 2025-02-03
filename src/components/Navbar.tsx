import { Button } from "@/components/ui/button";
import { isAuthenticated, isDelivery, isRestaurant, logout } from "@/services/auth.service";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            Rapido
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {!isRestaurant() && !isDelivery() && (
              <Button variant="ghost" asChild>
                <Link to="/restaurants">Restaurants</Link>
              </Button>)
            }
            {isRestaurant() && (
              <Button variant="ghost" asChild>
                <Link to="/restaurant/dashboard">Orders</Link>
              </Button>)
            }
            {isRestaurant() && (
                <Button variant="ghost" asChild>
                  <Link to="/restaurant/dishes">Dishes</Link>
                </Button>)
            }
            {!isAuthenticated() && (
              <Button variant="ghost" asChild>
                <Link to="/partner">Partner with Us</Link>
              </Button>)
            }
            {
              !isAuthenticated() ?
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              :
              <Button asChild onClick={() => logout()}>
                <a href="/">Log out</a>
              </Button>
            }
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {!isRestaurant() && !isDelivery() &&(
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/restaurants">Restaurants</Link>
              </Button>)
            }
            {isRestaurant() &&(
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/restaurant/dashboard">Orders</Link>
                </Button>)
            }
            {isRestaurant() && (
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/restaurant/dishes">Dishes</Link>
                </Button>)
            }
            {
              !isAuthenticated() && (
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/partner">Partner with Us</Link> 
                </Button>)
            }
            {
              !isAuthenticated() ? (
                <Button asChild className="w-full justify-start">
                  <Link to="/login">Login</Link>
              </Button>)
              : (
              <Button asChild onClick={() => logout()} className="w-full justify-start">
                <a href="/">Log out</a>
              </Button>)
            }
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;