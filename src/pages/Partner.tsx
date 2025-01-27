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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/types/auth';

function Partner() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [role, setRole] = React.useState<UserRole>('delivery');
    const [address, setAddress] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [openingTime, setOpeningTime] = React.useState('');
    const [closingTime, setClosingTime] = React.useState('');


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call register API
            if (role === 'chef') {
                // Call register API for chef
                await register(email, password, name, role, address, description, openingTime, closingTime);
            } else {
                await register(email, password, name, role);
            }
            toast({
                title: 'Register successful',
                description: `Welcome! You are registered as a partner`,
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
                            type="email"
                            placeholder="Email"
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
                        {role === 'chef' && (
                            <Input
                                type="text"
                                placeholder="Address"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <div>
                        {role === 'chef' && (
                            <Input
                                type="text"
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <div>
                        {role === 'chef' && (
                            <Input
                                type="text"
                                placeholder="Opening Time"
                                onChange={(e) => setOpeningTime(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <div>
                        {role === 'chef' && (
                            <Input
                                type="text"
                                placeholder="Closing Time"
                                onChange={(e) => setClosingTime(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <div>
                        <Select
                            defaultValue="delivery"
                            onValueChange={(value) => setRole(value.toLowerCase() as UserRole)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="delivery">Delivery</SelectItem>
                                <SelectItem value="chef">Chef</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" variant="default" className="w-full">
                        Register
                    </Button>
                    <div className="text-center">
                        <Link to="/login" className="text-sm text-primary">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Partner;