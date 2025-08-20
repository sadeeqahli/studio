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
import { addUser, getUserByReferralCode, addReferral, generateReferralCode } from "@/app/actions";
import { setCookie } from 'cookies-next'; // Assuming you have cookies-next installed for cookie management

export default function UserSignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (formData.password.length < 5) {
      toast({
          title: "Password Too Short",
          description: "Your password must be at least 5 characters long.",
          variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
          title: "Passwords Do Not Match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check if user already exists (assuming 'users' is available in scope or fetched)
    // For this example, we'll assume a function to check existing users.
    // In a real app, you'd fetch this data or have it available.
    const { getUsers } = await import('@/app/actions'); // Assuming getUsers action exists
    const users = await getUsers();
    const existingUser = users.find(
      u => u.email.toLowerCase() === formData.email.toLowerCase() && u.role === 'Player'
    );

    if (existingUser) {
      toast({
        title: "Account exists",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Validate referral code if provided
    let referrer = null;
    if (formData.referralCode.trim()) {
      referrer = await getUserByReferralCode(formData.referralCode.trim());

      if (!referrer) {
        toast({
          title: "Invalid referral code",
          description: "The referral code you entered is not valid.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password, // In a real app, hash the password
      role: 'Player',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      totalBookings: 0,
      rewardBalance: 0, // Initialize reward wallet
      referralCount: 0,
      referredBy: formData.referralCode.trim() || undefined,
      action: 'Signed Up' as const,
    };

    try {
      await addUser(newUser);

      // Create referral record if user was referred
      if (referrer) {
        const referral = {
          id: `REF-${Date.now()}`,
          referrerId: referrer.id,
          refereeId: newUser.id,
          refereeEmail: newUser.email,
          refereeName: newUser.name,
          status: 'Pending',
          completedBookings: 0,
          bonusAwarded: false,
          dateReferred: new Date().toISOString().split('T')[0],
        };

        await addReferral(referral);
      }

      // Generate referral code for the new user
      await generateReferralCode();

      toast({
        title: "Account created successfully!",
        description: "Please log in to access your dashboard.",
      });

      // Clear any existing login cookies to ensure fresh login
      const { deleteCookie } = await import('cookies-next');
      deleteCookie('loggedInUserId');
      
      router.push('/login?message=signup-success');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Input
                id="first-name"
                placeholder="Max"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="referralCode">Referral Code (Optional)</Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code if you have one"
              value={formData.referralCode || ''}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
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