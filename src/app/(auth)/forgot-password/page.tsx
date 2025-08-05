
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
    
    // In a real app, you would generate and email a code.
    // For this prototype, we'll generate it and show it in the toast.
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${email}. (Code for testing: ${verificationCode})`,
    });
    
    // Pass the email to the next page to keep track of who is resetting
    router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a code to reset your password.
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
            Send Verification Code
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
