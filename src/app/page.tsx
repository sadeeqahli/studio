
"use client";

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">9ja Pitch Connect</span>
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
            >
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    The Heartbeat of Nigerian Football
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect, book, and play. 9ja Pitch Connect is your ultimate platform for finding the best football pitches across Nigeria.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/home" prefetch={false}>
                      Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/signup/owner" prefetch={false}>
                      List Your Pitch
                    </Link>
                  </Button>
                </div>
              </div>
              <motion.img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="football match"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
          </div>
        </section>
        
        {/* Features and Footer sections would go here */}

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} 9ja Pitch Connect. All rights reserved.</p>
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
          <Link href="/admin/login" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Admin
          </Link>
        </nav>
      </footer>
    </div>
  );
}
