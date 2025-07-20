
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { MapPin, ShieldCheck, CalendarCheck, Search, ListChecks, Bell, Star } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Find Pitches Easily',
      description: 'Discover and book football pitches near you with our simple search and filter options.',
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-primary" />,
      title: 'Real-time Availability',
      description: 'Check pitch availability in real-time and book your slot instantly without back-and-forth calls.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Secure Payments',
      description: 'Pay for your bookings securely in Naira using your preferred method, with receipts for every transaction.',
    },
    {
      icon: <ListChecks className="w-8 h-8 text-primary" />,
      title: 'Manage Bookings',
      description: 'Pitch owners can easily manage their pitch details, availability, and bookings from their dashboard.',
    },
    {
        icon: <Star className="w-8 h-8 text-primary" />,
        title: 'AI Recommendations',
        description: 'Get personalized pitch suggestions based on your preferences for location, budget, and amenities.',
    },
    {
        icon: <MapPin className="w-8 h-8 text-primary" />,
        title: 'Map Integration',
        description: 'Visualize pitch locations on an interactive map to find the perfect spot for your game.',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">Naija Pitch Connect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Button asChild>
            <Link href="/signup" prefetch={false}>
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    The Heartbeat of Nigerian Football
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect, book, and play. Naija Pitch Connect is your ultimate platform for finding the best football pitches across Nigeria.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard" prefetch={false}>
                      Find a Pitch
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/signup/owner" prefetch={false}>
                      List Your Pitch
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="football match"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need for the Beautiful Game</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide a seamless experience for both players looking for a game and pitch owners wanting to maximize their bookings.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
  );
}
