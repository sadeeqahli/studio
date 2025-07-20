
"use client";

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// A simple SVG for a football player icon
const FootballPlayerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M15.5 8.5L18 12l-4.5 4" />
        <path d="M8.5 8.5L6 12l4.5 4" />
        <path d="M12 12v10" />
    </svg>
);


export default function WelcomePage() {
  return (
    <div className="relative flex flex-col min-h-screen w-full items-center justify-center overflow-hidden bg-background">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-0"
        >
            <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            {/* Animated Icons */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-primary"
                    initial={{
                        x: Math.random() * 100 + 'vw',
                        y: Math.random() * 100 + 'vh',
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3 + 0.1
                    }}
                    animate={{
                        y: '-20vh',
                        x: `+=${Math.random() * 40 - 20}vw`,
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear'
                    }}
                >
                    <FootballPlayerIcon />
                </motion.div>
            ))}
        </motion.div>

        <main className="z-10 flex flex-col items-center justify-center text-center p-4">
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
             >
                <Logo className="h-16 w-16" />
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary">
                    Naija Pitch Connect
                </h1>
            </motion.div>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-2xl text-muted-foreground md:text-xl mb-8"
            >
                The ultimate platform to connect football players with the best pitches across Nigeria. Ready to play?
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Button asChild size="lg" className="group">
                    <Link href="/home" prefetch={false}>
                        Enter the Arena <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </motion.div>
        </main>
         <footer className="absolute bottom-6 text-xs text-muted-foreground z-10">
            &copy; {new Date().getFullYear()} Naija Pitch Connect. All rights reserved.
        </footer>
    </div>
  );
}

