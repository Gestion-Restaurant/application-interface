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
            <Button variant="ghost" asChild>
              {!isRestaurant() && !isDelivery() ? <Link to="/restaurants">Restaurants</Link> : '' }
            </Button>
            {
              isRestaurant() ?
              <>
                <Button variant="ghost" asChild>
                  <Link to="/restaurant/dashboard">Orders</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/restaurant/menu">Dishes</Link>
                </Button>
              </>
              : ''
            }
            <Button variant="ghost" asChild>
              {!isAuthenticated() ? <Link to="/partner">Partner with Us</Link> : ''}
            </Button>
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

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost" asChild className="w-full justify-start">
                {!isRestaurant() && !isDelivery() ? <Link to="/restaurants">Restaurants</Link> : '' }
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/orders">Orders</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                {!isAuthenticated() ? <Link to="/partner">Partner with Us</Link> : ''}
              </Button>
              {
                !isAuthenticated() ?
                <Button asChild className="w-full justify-start">
                  <Link to="/login">Login</Link>
                </Button>
                :
                <Button asChild onClick={() => logout()} className="w-full justify-start">
                  <a href="/">Log out</a>
                </Button>
              }
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;