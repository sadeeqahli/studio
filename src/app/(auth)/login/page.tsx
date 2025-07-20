
"use client";

import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const userType = searchParams.get('type');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    const isOwner = userType === 'owner';
    const redirectPath = isOwner ? '/owner/dashboard' : '/dashboard';
    const welcomeMessage = isOwner ? "Welcome back, Owner! Redirecting you to your dashboard." : "Welcome back! Redirecting you to your dashboard.";

    toast({
        title: "Login Successful",
        description: welcomeMessage,
    });
    // In a real app, you'd have authentication logic here.
    // We'll simulate a successful login and redirect.
    router.push(redirectPath);
  };

  const signupLink = userType === 'owner' ? '/signup/owner' : '/signup/user';

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{userType === 'owner' ? 'Owner Login' : 'Player Login'}</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full" onClick={(e) => {e.preventDefault(); alert("Login with Google clicked!")}}>
            Login with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href={signupLink} className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
