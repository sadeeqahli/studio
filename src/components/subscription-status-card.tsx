
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SubscriptionStatusCard() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // For demonstration, let's assume the subscription started 10 days ago and lasts 30 days.
    // In a real app, you would fetch the subscription start date from your backend.
    const subscriptionStartDate = new Date();
    subscriptionStartDate.setDate(subscriptionStartDate.getDate() - 10);
    const subscriptionEndDate = new Date(subscriptionStartDate);
    subscriptionEndDate.setDate(subscriptionStartDate.getDate() + 30);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = subscriptionEndDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const totalDuration = 30 * 24 * 60 * 60 * 1000;
    const timeElapsed = new Date().getTime() - subscriptionStartDate.getTime();
    const progress = Math.max(0, (timeElapsed / totalDuration) * 100);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Subscription Status
                </CardTitle>
                <CardDescription>Your current active plan is <span className="font-semibold text-primary">Plus Plan</span>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="grid grid-cols-4 gap-2 text-center mb-2">
                        <div>
                            <span className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-xs text-muted-foreground block">Days</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-xs text-muted-foreground block">Hours</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-xs text-muted-foreground block">Mins</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                             <span className="text-xs text-muted-foreground block">Secs</span>
                        </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                     <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Time left until next renewal</p>
                </div>
                <Button className="w-full" variant="outline" onClick={() => router.push('/owner/dashboard/pricing')}>
                    <Zap className="mr-2 h-4 w-4" /> Manage Subscription
                </Button>
            </CardContent>
        </Card>
    );
}
