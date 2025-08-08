"use client";

import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from 'lucide-react';

function SetPinDialog() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [pin, setPin] = React.useState("");
    const [confirmPin, setConfirmPin] = React.useState("");

    const handleSetPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4) {
            toast({ title: "Invalid PIN", description: "PIN must be 4 digits.", variant: "destructive" });
            return;
        }
        if (pin !== confirmPin) {
            toast({
                title: "PINs do not match",
                description: "Please ensure both PINs are the same.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);

        // In a real app, you'd securely save this PIN against the user's record.
        setTimeout(() => {
            setIsLoading(false);
            setIsOpen(false);
            setPin("");
            setConfirmPin("");
            toast({
                title: "PIN Set Successfully",
                description: "Your transaction PIN has been updated."
            });
        }, 1500);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Set/Change PIN</Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Set Your Transaction PIN</DialogTitle>
                    <DialogDescription>
                       This 4-digit PIN will be required for all withdrawals. Keep it secure.
                    </DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleSetPin}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pin">New PIN</Label>
                            <Input id="pin" type="password" placeholder="****" required maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-pin">Confirm New PIN</Label>
                            <Input id="confirm-pin" type="password" placeholder="****" required maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Set PIN'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function PinManagementCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction PIN</CardTitle>
                <CardDescription>For added security, set a 4-digit PIN for all withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary"/>
                        <p className="text-sm font-medium">Your PIN is set and active.</p>
                    </div>
                    <SetPinDialog />
                </div>
            </CardContent>
        </Card>
    );
}
