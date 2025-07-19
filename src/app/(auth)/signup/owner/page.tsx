"use client";

import Link from "next/link"
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

export default function OwnerSignupForm() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();
        toast({
            title: "Account Created!",
            description: "Welcome! We're redirecting you to your owner dashboard.",
        });
        // In a real app, you'd have registration logic here.
        // We'll simulate a successful signup and redirect.
        router.push('/owner/dashboard');
    };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create your Pitch Owner Account</CardTitle>
        <CardDescription>
          Enter your information to list your pitch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="owner-name">Full Name</Label>
            <Input id="owner-name" placeholder="Tunde Ojo" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pitch-name">Pitch Name</Label>
            <Input id="pitch-name" placeholder="Lekki Goals Arena" required />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
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
