
"use client";

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

export default function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleReset = (event: React.FormEvent) => {
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

    // In a real app, you would update the user's password in the database here.
    toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
    });
    router.push('/login');
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create a New Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
