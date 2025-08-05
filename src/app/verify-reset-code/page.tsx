
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
import { ArrowLeft } from "lucide-react";

export default function VerifyResetCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [code, setCode] = React.useState('');
  const email = searchParams.get('email');

  const handleVerifyCode = (event: React.FormEvent) => {
    event.preventDefault();
    
    // In a real app, you would verify the code against a value stored
    // in your database or a temporary cache. For this prototype, any 6-digit code will work.
    if (code.length === 6 && /^\d{6}$/.test(code)) {
        toast({
            title: "Code Verified",
            description: "You can now reset your password.",
        });
        router.push('/reset-password');
    } else {
        toast({
            title: "Invalid Code",
            description: "Please enter a valid 6-digit verification code.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
            <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
            <CardDescription>
            A 6-digit code was sent to {email || 'your email'}. Enter it below.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleVerifyCode} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                id="code"
                type="text"
                placeholder="123456"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full">
                Verify & Proceed
            </Button>
            </form>
            <div className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="flex items-center justify-center text-muted-foreground hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1"/> Didn't get a code?
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
