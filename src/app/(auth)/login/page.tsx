

"use client";

import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation';
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
import { placeholderCredentials, placeholderActivities } from "@/lib/placeholder-data";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const userType = searchParams.get('type');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    const isOwner = userType === 'owner';
    const expectedRole = isOwner ? 'Owner' : 'Player';
    
    // Find user by email and role
    const user = placeholderCredentials.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.role === expectedRole
    );

    // Check if user exists and password is correct
    if (user && user.password === password) {
      const redirectPath = isOwner ? '/owner/dashboard' : '/dashboard';
      const welcomeMessage = isOwner ? "Welcome back, Owner! Redirecting..." : "Welcome back! Redirecting...";

      // Simulate adding a login activity
      placeholderActivities.unshift({
          id: `ACT-${Date.now()}`,
          userName: user.name,
          userRole: user.role as 'Player' | 'Owner',
          action: 'Logged In',
          timestamp: new Date().toISOString(),
      });

      toast({
          title: "Login Successful",
          description: welcomeMessage,
      });
      router.push(redirectPath);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isOwnerLogin = userType === 'owner';

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{isOwnerLogin ? 'Owner Login' : 'Player Login'}</CardTitle>
        <CardDescription>
          Enter your email below to login to your account on 9ja Pitch Connect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isOwnerLogin ? (
            <>
              Don't have an owner account?{" "}
              <Link href="/signup/owner" className="underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </>
          )}
        </div>
         <div className="mt-2 text-center text-sm">
            {isOwnerLogin ? (
                 <Link href="/login" className="text-muted-foreground hover:underline">
                    Are you a player? Login here.
                </Link>
            ) : (
                 <Link href="/login?type=owner" className="text-muted-foreground hover:underline">
                    Are you a pitch owner? Login here.
                </Link>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
