
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const pricingTiers = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for getting started and listing your first pitch.",
        features: [
            "List 2 pitch",
            "Basic booking management",
            "Standard support",
            "10% booking commission",
        ],
        cta: "Continue for Free",
        href: "/owner/dashboard",
        popular: false,
        isAvailable: true,
    },
    {
        name: "Plus",
        price: "₦20,000",
        price_sub: "/ month + VAT",
        description: "For growing businesses looking to expand their reach.",
        features: [
            "List unlimited pitches",
            "Advanced booking calendar",
            "Priority support",
            "5% booking commission",
            "Basic analytics dashboard",
        ],
        cta: "Coming Soon",
        href: "#",
        popular: true,
        isAvailable: false,
    },
    {
        name: "Pro",
        price: "₦40,000",
        price_sub: "/ month + VAT",
        description: "The complete solution for professional pitch management.",
        features: [
            "List unlimited pitches",
            "Full availability management",
            "Dedicated 24/7 support",
            "3% booking commission",
            "Advanced analytics & reporting",
            "Featured listing placement"
        ],
        cta: "Coming Soon",
        href: "#",
        popular: false,
        isAvailable: false,
    }
];

export default function OwnerPricingPage() {
  const router = useRouter();

  return (
    <>
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Choose Your Plan</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">Select a subscription to unlock your dashboard and start managing your pitches.</p>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {pricingTiers.map(tier => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-2xl lg:scale-105' : ''}`}>
                    {tier.popular && (
                        <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                            <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
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
                                    <span className="text-muted-foreground">{feature}</span>
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
        <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link>.</p>
        </div>
    </>
  )
}
