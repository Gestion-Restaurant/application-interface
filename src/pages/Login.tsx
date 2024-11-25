import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual authentication logic here
    // For now, we'll simulate a login based on the selected role
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store user info in localStorage (replace with proper auth later)
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email,
        role,
        name: 'John Doe'
      }));

      toast({
        title: "Login successful",
        description: `Welcome back! You are logged in as a ${role.replace('_', ' ')}`,
      });

      // Redirect based on role
      switch (role) {
        case 'restaurant_owner':
          navigate('/restaurant/dashboard');
          break;
        case 'delivery_guy':
          navigate('/delivery/dashboard');
          break;
        case 'customer':
          navigate('/restaurants');
          break;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to DeliveryApp</CardTitle>
          <CardDescription>
            Please login to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <select
                className="w-full p-2 border rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="customer">Customer</option>
                <option value="restaurant_owner">Restaurant Owner</option>
                <option value="delivery_guy">Delivery Guy</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;