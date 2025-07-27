
"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Banknote, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

    const handlePayment = (e: React.FormEvent, method: 'card' | 'transfer') => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call for payment
        setTimeout(() => {
            setIsLoading(false);
            const successMessage = method === 'card' 
                ? `You have successfully subscribed to the ${details.name}.`
                : `Your subscription to ${details.name} is pending. We will confirm upon receipt of payment.`;

            toast({
                title: method === 'card' ? "Payment Successful!" : "Subscription Pending",
                description: successMessage,
            });
            // Redirect to owner dashboard
            router.push('/owner/dashboard');
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
                        <Button onClick={() => router.push('/owner/dashboard/pricing')} className="w-full">
                            View Pricing Plans
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Complete Your Subscription</CardTitle>
                    <CardDescription>You are subscribing to the <span className="font-bold text-primary">{details.name}</span> for <span className="font-bold">₦{details.price}/month</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Tabs defaultValue="card">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" />Card</TabsTrigger>
                            <TabsTrigger value="transfer"><Banknote className="mr-2 h-4 w-4" />Transfer</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card" className="mt-4">
                             <form onSubmit={(e) => handlePayment(e, 'card')}>
                                <div className="space-y-4">
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
                                </div>
                                <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        `Pay ₦${details.price}`
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="transfer" className="mt-4">
                             <form onSubmit={(e) => handlePayment(e, 'transfer')}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bank Transfer</CardTitle>
                                        <CardDescription>Transfer the total amount to the account below.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bank Name:</span>
                                            <span className="font-semibold">Kuda MFB</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Account Name:</span>
                                            <span className="font-semibold">Naija Pitch Connect Ltd.</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Account Number:</span>
                                            <span className="font-semibold">9876543210</span>
                                        </div>
                                        <Alert className="mt-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                            Use your email address as the payment reference for faster confirmation.
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                                 <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                                    ) : (
                                        `I have made the transfer`
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
