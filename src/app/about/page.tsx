
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">About Naija Pitch Connect</h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">Our mission is to fuel the passion for football across Nigeria by connecting players with quality pitches.</p>
                </div>
            </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Story</div>
                    <h2 className="text-3xl font-bold tracking-tighter">Born from a Love for the Game</h2>
                    <p className="text-muted-foreground">
                        Naija Pitch Connect was founded by a group of friends who were tired of the hassle of finding and booking a good football pitch. We envisioned a single platform where anyone, anywhere in Nigeria, could find a great place to play the beautiful game. We believe that football has the power to unite communities, and our goal is to remove the barriers that stand between you and your next match.
                    </p>
                    <p className="text-muted-foreground">
                        From the grassroots to local leagues, we're here to support Nigerian football at every level. We're committed to creating a seamless, trustworthy, and user-friendly experience for both players and pitch owners.
                    </p>
                </div>
                 <Image
                    src="https://placehold.co/600x400.png"
                    width="600"
                    height="400"
                    alt="Team celebrating"
                    data-ai-hint="team celebrating"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
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
