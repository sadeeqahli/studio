
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SubscriptionStatusCard() {
    const router = useRouter();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Subscription Status
                </CardTitle>
                <CardDescription>Your current active plan is <span className="font-semibold text-primary">Starter Plan (Free)</span>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold">Upgraded plans are coming soon!</p>
                    <p className="text-xs mt-1">Get ready for lower commission rates and advanced features.</p>
                </div>
                <Button className="w-full" variant="outline" onClick={() => router.push('/owner/dashboard/pricing')}>
                    <Zap className="mr-2 h-4 w-4" /> Upgrade Plan
                </Button>
            </CardContent>
        </Card>
    );
}
