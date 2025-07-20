
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const pricingTiers = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for getting started and listing your first pitch.",
        features: [
            "List 1 pitch",
            "Basic booking management",
            "Standard support",
            "10% booking commission",
        ],
        cta: "Get Started",
        href: "/signup/owner",
        popular: false,
        paid: false,
        planId: "starter"
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
        cta: "Choose Plus",
        href: "/pricing/subscribe?plan=plus",
        popular: true,
        paid: true,
        planId: "plus"
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
        cta: "Go Pro",
        href: "/pricing/subscribe?plan=pro",
        popular: false,
        paid: true,
        planId: "pro"
    }
];

export default function PricingPage() {
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  return (
    <>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Simple, Transparent Pricing</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">Choose a plan that fits your business. No hidden fees, ever.</p>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
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
                                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'} disabled={tier.paid && !agreedToTerms}>
                                    <Link href={tier.href}>{tier.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                 </div>
                 <div className="flex items-center justify-center space-x-2 mt-12">
                    <Checkbox id="terms" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the <Link href="#" className="underline hover:text-primary">terms of service</Link> and subscription policy.
                    </Label>
                </div>
            </div>
        </section>
    </>
  )
}
