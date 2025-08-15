
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const pricingTiers = [
    {
        name: "Starter",
        price: "Free",
        price_sub: "",
        description: "Perfect for getting started with a 1 month 10 days free trial.",
        features: [
            "List 2 pitches",
            "Basic booking management",
            "Standard support",
            "5% booking commission (after trial)",
            "1 month 10 days FREE trial",
            "No commission during trial period"
        ],
        cta: "Start Free Trial",
        href: "/owner/dashboard",
        popular: false,
        isAvailable: true,
        trialPeriod: "40 days free trial"
    },
    {
        name: "Plus",
        price: "₦20,000",
        price_sub: "/ month + VAT",
        description: "Most popular plan for growing businesses with better commission rates.",
        features: [
            "List 5 pitches maximum",
            "Advanced booking calendar",
            "24/7 platform support",
            "3% booking commission",
            "Basic analytics dashboard",
            "1 month 10 days FREE trial",
            "Priority customer support"
        ],
        cta: "Coming Soon",
        href: "#",
        popular: true,
        isAvailable: false,
        trialPeriod: "40 days free trial"
    },
    {
        name: "Pro",
        price: "₦40,000",
        price_sub: "/ month + VAT",
        description: "The complete solution for professional pitch management with lowest commission.",
        features: [
            "List unlimited pitches",
            "Full availability management",
            "Dedicated 24/7 support",
            "1.5% booking commission",
            "Advanced analytics & reporting",
            "Featured listing placement",
            "1 month 10 days FREE trial",
            "Premium onboarding support"
        ],
        cta: "Coming Soon",
        href: "#",
        popular: false,
        isAvailable: false,
        trialPeriod: "40 days free trial"
    }
];

export default function OwnerPricingPage() {
  const router = useRouter();

  return (
    <>
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Choose Your Plan</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">Start with our free trial and select a subscription to unlock your dashboard and manage your pitches.</p>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Limited Time: 40 Days FREE Trial on All Plans!
            </div>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {pricingTiers.map(tier => (
                <Card key={tier.name} className={`flex flex-col relative ${tier.popular ? 'border-primary shadow-2xl lg:scale-105' : ''}`}>
                    {tier.popular && (
                        <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                            <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                        </div>
                    )}
                    
                    {tier.trialPeriod && (
                        <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold rounded-t-lg">
                            {tier.trialPeriod}
                        </div>
                    )}
                    
                    <CardHeader className="items-center text-center">
                        <CardTitle className="text-2xl">{tier.name}</CardTitle>
                        <p className="text-4xl font-bold">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.price_sub}</span></p>
                        <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {tier.features.map(feature => (
                                <li key={feature} className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                                    <span className={`text-muted-foreground ${feature.includes('FREE trial') || feature.includes('No commission') ? 'font-semibold text-green-600' : ''}`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={() => tier.isAvailable && router.push(tier.href)}
                            className="w-full" 
                            variant={tier.popular && tier.isAvailable ? 'default' : 'outline'} 
                            disabled={!tier.isAvailable}
                        >
                           {tier.cta}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
        <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link>.</p>
            <p className="text-xs text-green-600 font-medium">
                🎉 Special Launch Offer: Reduced commission rates to attract more owners to our platform!
            </p>
        </div>
    </>
  )
}
