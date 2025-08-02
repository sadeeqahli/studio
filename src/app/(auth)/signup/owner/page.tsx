
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

export default function OwnerSignupForm() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();
        toast({
            title: "Verification Pending",
            description: "Thank you for submitting your details. Your account is under review. We will notify you via email once your verification is complete.",
        });
        // In a real app, you'd handle the form data and verification logic.
        // For now, we'll just redirect to the login page.
        router.push('/login?type=owner');
    };

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create your Pitch Owner Account</CardTitle>
        <CardDescription>
          Enter your information to list your pitch. Verification is required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
            <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                    To ensure the safety of our users, we require identity and business verification before you can list a pitch.
                </AlertDescription>
            </Alert>
          <div className="grid gap-2">
            <Label htmlFor="owner-name">Full Name</Label>
            <Input id="owner-name" placeholder="Tunde Ojo" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pitch-name">Pitch Name / Business Name</Label>
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

          <div className="grid gap-2">
            <Label htmlFor="nin">National Identification Number (NIN)</Label>
            <Input id="nin" type="text" placeholder="Enter your 11-digit NIN" required maxLength={11} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="document">NIN Verification Document</Label>
            <Input id="document" type="file" required />
            <p className="text-xs text-muted-foreground">Please upload your NIN slip or a clear photo of your National ID card.</p>
          </div>

          <Button type="submit" className="w-full">
            Submit for Verification
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login?type=owner" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
