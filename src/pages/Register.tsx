import { useToast } from '@/hooks/use-toast';
import { register } from '@/services/auth.service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call register API
            await register(email, password, name, 'client', address);
            toast({
                title: 'Register successful',
                description: `Welcome! You are registered as a client`,
            });

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
            
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to DeliveryApp</CardTitle>
                        <CardDescription>
                            Please register to continue
                        </CardDescription>
                    </CardHeader>
                <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
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
                        Sign up
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                        Login
                    </Link>
                    </p>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register;