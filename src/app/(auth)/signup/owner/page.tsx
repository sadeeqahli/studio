

"use client";

import Link from "next/link"
import * as React from 'react';
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";
import { addUserCredential } from "@/lib/placeholder-data";

export default function OwnerSignupForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();

        if (password.length < 5) {
            toast({
                title: "Password Too Short",
                description: "Your password must be at least 5 characters long.",
                variant: "destructive",
            });
            return;
        }
        
        if (password !== confirmPassword) {
            toast({
                title: "Passwords Do Not Match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
            return;
        }
        
        // Add new user to our placeholder data
        addUserCredential({
            id: `USR-${Date.now()}`,
            name: fullName,
            email: email,
            password: password,
            role: 'Owner',
            registeredDate: new Date().toISOString().split('T')[0],
            status: 'Active', // Or 'Pending' if verification is a real step
            pitchesListed: 0
        });

        toast({
            title: "Verification Pending",
            description: "Thank you for submitting. Please log in to continue once your account is approved.",
        });

        router.push('/login?type=owner');
    };

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create your Pitch Owner Account</CardTitle>
        <CardDescription>
          Enter your information to list your pitch. Verification is required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
            <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                    To ensure the safety of our users, we require identity and business verification before you can list a pitch.
                </AlertDescription>
            </Alert>
          <div className="grid gap-2">
            <Label htmlFor="owner-name">Full Name</Label>
            <Input id="owner-name" placeholder="Tunde Ojo" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pitch-name">Pitch Name / Business Name</Label>
            <Input id="pitch-name" placeholder="Lekki Goals Arena" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nin">National Identification Number (NIN)</Label>
            <Input id="nin" type="text" placeholder="Enter your 11-digit NIN" required maxLength={11} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="document">NIN Verification Document</Label>
            <Input id="document" type="file" required />
            <p className="text-xs text-muted-foreground">Please upload your NIN slip or a clear photo of your National ID card.</p>
          </div>

          <Button type="submit" className="w-full">
            Submit for Verification
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login?type=owner" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
