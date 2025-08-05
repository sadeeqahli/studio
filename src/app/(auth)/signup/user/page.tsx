

"use client";

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from 'react';

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
import { addUserCredential } from "@/lib/placeholder-data";

export default function UserSignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
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
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
        role: 'Player',
        registeredDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        totalBookings: 0,
    });

    toast({
        title: "Account Created!",
        description: "Welcome! Please log in to continue.",
    });
    router.push('/login');
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create your Player Account</CardTitle>
        <CardDescription>
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
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
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
