
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
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');

  const handleResetRequest = (event: React.FormEvent) => {
    event.preventDefault();
    
    toast({
        title: "Reset Link Sent",
        description: `If an account exists for ${email}, a password reset link has been sent.`,
    });
    
    // In a real app, you would not redirect immediately,
    // but for this prototype, we'll go to the reset page.
    router.push('/reset-password');
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetRequest} className="grid gap-4">
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
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="flex items-center justify-center text-muted-foreground hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1"/> Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
