
"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";

const planDetails = {
    plus: { name: "Plus Plan", price: "20,000" },
    pro: { name: "Pro Plan", price: "40,000" },
};

export default function SubscribePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const plan = searchParams.get("plan") as keyof typeof planDetails;
    
    const details = planDetails[plan] || { name: "Subscription", price: "N/A" };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call for payment
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Payment Successful!",
                description: `You have successfully subscribed to the ${details.name}.`,
            });
            // Redirect to signup page to complete registration
            router.push('/signup/owner');
        }, 2000);
    };

    if (!plan || !planDetails[plan]) {
        return (
            <div className="flex items-center justify-center py-20">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Invalid Plan</CardTitle>
                        <CardDescription>The subscription plan you selected is not valid. Please go back and select a plan.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/pricing')} className="w-full">
                            View Pricing Plans
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center py-12 md:py-24">
            <Card className="max-w-md w-full">
                <form onSubmit={handlePayment}>
                    <CardHeader>
                        <CardTitle>Complete Your Subscription</CardTitle>
                        <CardDescription>You are subscribing to the <span className="font-bold text-primary">{details.name}</span> for <span className="font-bold">₦{details.price}/month</span>.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                                <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM / YY" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name-on-card">Name on Card</Label>
                            <Input id="name-on-card" placeholder="Full Name" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                            ) : (
                                `Pay ₦${details.price}`
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
