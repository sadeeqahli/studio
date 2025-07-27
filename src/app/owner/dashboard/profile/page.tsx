
"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, ShieldCheck, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function SetPinDialog() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [pin, setPin] = React.useState("");
    const [confirmPin, setConfirmPin] = React.useState("");

    const handleSetPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin !== confirmPin) {
            toast({
                title: "PINs do not match",
                description: "Please ensure both PINs are the same.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);

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


export default function OwnerProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();


  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your profile information has been updated.",
    });
  };

  const handleUpdatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your password has been changed. You will be logged out shortly.",
    });
  };

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Owner Profile & Settings</h1>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>Update your personal and business details here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="owner-name">Full Name</Label>
                        <Input id="owner-name" defaultValue="Tunde Ojo" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="tunde.ojo@example.com" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                </CardFooter>
            </Card>

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

            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Switch between light and dark mode.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <span className="text-sm text-muted-foreground">{theme === 'light' ? 'Current theme: Light' : 'Current theme: Dark'}.</span>
                     <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
