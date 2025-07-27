
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CreditCard, Shield, List, BarChart } from "lucide-react";

export default function HowItWorksPage() {
    const stepsForPlayers = [
        { icon: <Search className="w-10 h-10 text-primary" />, title: "1. Search", description: "Use our search bar and filters to find the perfect pitch based on location, price, and amenities." },
        { icon: <Calendar className="w-10 h-10 text-primary" />, title: "2. Book", description: "Check real-time availability and select a time slot that works for you and your team." },
        { icon: <CreditCard className="w-10 h-10 text-primary" />, title: "3. Pay", description: "Complete your booking with our secure online payment system. You'll receive a confirmation instantly." },
        { icon: <Shield className="w-10 h-10 text-primary" />, title: "4. Play", description: "Show up at the pitch at your booked time and enjoy the game. It's that simple!" },
    ];
    const stepsForOwners = [
        { icon: <List className="w-10 h-10 text-primary" />, title: "1. List Your Pitch", description: "Create an account and provide details about your pitch, including location, price, and photos." },
        { icon: <Calendar className="w-10 h-10 text-primary" />, title: "2. Set Availability", description: "Use our intuitive dashboard to manage your booking calendar and block out unavailable times." },
        { icon: <CreditCard className="w-10 h-10 text-primary" />, title: "3. Get Paid", description: "Receive payments securely and on time directly through our platform for every booking made." },
        { icon: <BarChart className="w-10 h-10 text-primary" />, title: "4. Track Performance", description: "Access analytics and insights to understand your pitch's performance and maximize your revenue." },
    ];

  return (
    <div className="flex flex-col min-h-screen">
       <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">Naija Pitch Connect</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">How It Works</h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">A simple process for players and pitch owners.</p>
                </div>
            </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">For Players</h2>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
                    {stepsForPlayers.map((step, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader className="flex flex-col items-center gap-4">
                                {step.icon}
                                <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">For Pitch Owners</h2>
                 <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
                    {stepsForOwners.map((step, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader className="flex flex-col items-center gap-4">
                                {step.icon}
                                <CardTitle>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </CardContent>
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
