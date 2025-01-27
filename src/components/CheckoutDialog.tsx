import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./LoginForm";
import { isAuthenticated, isClient } from "@/services/auth.service";

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    total: number;
    onSuccess: () => void;
}

export const CheckoutDialog = ({ open, onOpenChange, total, onSuccess }: CheckoutDialogProps) => {
    const [step, setStep] = useState<"login" | "payment">(isAuthenticated() && isClient() ? "payment" : "login");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const { toast } = useToast();

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardNumber && expiryDate && cvv) {
            toast({
                title: "Payment successful",
                description: "Your order has been placed successfully!",
            });
            onSuccess();
            onOpenChange(false);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all payment details",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {step === "login" ? "Login or Register" : "Payment Details"}
                    </DialogTitle>
                </DialogHeader>
                {step === "login" ? (
                    <LoginForm onSuccess={() => setStep("payment")} />
                ) : (
                    <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="text"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-lg font-semibold">
                        Total: ${total.toFixed(2)}
                    </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                            Pay Now
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};