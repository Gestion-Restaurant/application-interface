import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { UserRoleEnum } from "@/types/auth";
import { login, setAuthToken, reloadPage } from "@/services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call login API
      const response = await login(email, password);

      // Store token in cookies
      setAuthToken(response.data.token);

      // Extract user role
      const role = response.data.user.role;
      
      toast({
        title: "Login successful",
        description: `Welcome back! You are logged in as a ${role.replace('_', ' ')}`,
      });

      // Redirect based on role
      switch (role) {
        case UserRoleEnum.CHEF:
          navigate('/restaurant/dashboard');
          break;
        case UserRoleEnum.DELIVERY:
          navigate('/delivery/dashboard');
          break;
        case UserRoleEnum.CLIENT:
          navigate('/restaurants');
          break;
      }
      reloadPage();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
};

export default Login;