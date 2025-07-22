
"use client";

import Link from "next/link"
import { useRouter } from 'next/navigation';
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
import { Logo } from "@/components/icons";

export default function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    // In a real app, use a proper authentication provider.
    // For this prototype, we'll use hardcoded credentials.
    if (email === 'admin@9japitchconnect.com' && password === 'admin123') {
        toast({
            title: "Admin Login Successful",
            description: "Welcome back, Admin! Redirecting you to the dashboard.",
        });
        router.push('/admin/dashboard');
    } else {
        toast({
            title: "Login Failed",
            description: "Invalid credentials. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
        <div className="mb-8 text-center">
            <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
                <Logo className="h-10 w-10" />
                <span className="text-2xl font-bold text-primary">9ja Pitch Connect</span>
            </Link>
             <p className="text-muted-foreground mt-2">Admin Portal</p>
        </div>
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
            Enter your credentials to access the admin panel.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="admin@9japitchconnect.com"
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
            <Button type="submit" className="w-full">
                Login
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}
