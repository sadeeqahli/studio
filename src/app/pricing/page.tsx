
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Check } from "lucide-react";

const pricingTiers = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for getting started and listing your first pitch.",
        features: [
            "List 1 pitch",
            "Basic booking management",
            "Standard support",
            "5% booking commission",
        ],
        cta: "Get Started",
        href: "/signup/owner",
        popular: false
    },
    {
        name: "Plus",
        price: "₦15,000",
        price_sub: "/ month + VAT",
        description: "For growing businesses looking to expand their reach.",
        features: [
            "List up to 5 pitches",
            "Advanced booking calendar",
            "Priority support",
            "3% booking commission",
            "Basic analytics dashboard",
        ],
        cta: "Choose Plus",
        href: "/signup/owner",
        popular: true
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
            "0% booking commission",
            "Advanced analytics & reporting",
            "Featured listing placement"
        ],
        cta: "Go Pro",
        href: "/signup/owner",
        popular: false
    }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">Naija Pitch Connect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login" prefetch={false}>
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup" prefetch={false}>
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
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
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
                    {pricingTiers.map(tier => (
                        <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-2xl scale-105' : ''}`}>
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
                                        <li key={feature} className="flex items-center">
                                            <Check className="h-5 w-5 text-primary mr-2" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                                    <Link href={tier.href}>{tier.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Naija Pitch Connect. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/about" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            About Us
          </Link>
          <Link href="/how-it-works" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            How It Works
          </Link>
          <Link href="/contact" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
