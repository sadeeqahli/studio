
"use client";

import Link from "next/link"
import * as React from 'react';
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
import { ShieldCheck, Upload } from "lucide-react";
import { addUser } from "@/app/actions";

export default function OwnerSignupForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [bvn, setBvn] = React.useState('');
    const [nin, setNin] = React.useState('');
    const [addressProof, setAddressProof] = React.useState<File | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type (accept images and PDFs)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a JPEG, PNG, or PDF file.",
                    variant: "destructive",
                });
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Please upload a file smaller than 5MB.",
                    variant: "destructive",
                });
                return;
            }
            
            setAddressProof(file);
        }
    };

    const handleSignup = async (event: React.FormEvent) => {
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

        if (bvn.length !== 11) {
            toast({
                title: "Invalid BVN",
                description: "BVN must be exactly 11 digits.",
                variant: "destructive",
            });
            return;
        }

        if (nin.length !== 11) {
            toast({
                title: "Invalid NIN",
                description: "NIN must be exactly 11 digits.",
                variant: "destructive",
            });
            return;
        }

        if (!addressProof) {
            toast({
                title: "Address Proof Required",
                description: "Please upload a proof of address document.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        
        try {
            // In a real app, you would upload the file to cloud storage here
            // For now, we'll just simulate the process
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add new user to our placeholder data
            await addUser({
                id: `USR-${Date.now()}`,
                name: fullName,
                email: email,
                password: password,
                role: 'Owner',
                registeredDate: new Date().toISOString().split('T')[0],
                status: 'Pending', // Set to pending for verification
                pitchesListed: 0,
                action: 'Signed Up',
                bvn: bvn,
                nin: nin,
                addressProofFileName: addressProof.name,
                verificationStatus: 'Pending'
            });

            toast({
                title: "Account Created",
                description: "Your account is under review. You'll be notified once verification is complete.",
            });

            router.push('/login?type=owner&message=verification-pending');
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your documents. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">Create your Pitch Owner Account</CardTitle>
        <CardDescription>
          Enter your information to list your pitch. All documents will be verified for security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            To prevent fraud and ensure platform security, we require BVN, NIN, and proof of address for all pitch owners.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="owner-name">Full Name</Label>
            <Input 
              id="owner-name" 
              placeholder="Tunde Ojo" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>
          
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
            <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
            <Input 
              id="bvn" 
              type="text" 
              placeholder="12345678901"
              maxLength={11}
              pattern="[0-9]{11}"
              required 
              value={bvn}
              onChange={(e) => setBvn(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="nin">National Identification Number (NIN)</Label>
            <Input 
              id="nin" 
              type="text" 
              placeholder="12345678901"
              maxLength={11}
              pattern="[0-9]{11}"
              required 
              value={nin}
              onChange={(e) => setNin(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address-proof">Proof of Address</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="address-proof" 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf"
                required 
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
              {addressProof && (
                <span className="text-sm text-muted-foreground">
                  {addressProof.name}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload utility bill, bank statement, or official document (Max 5MB, JPG/PNG/PDF)
            </p>
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
          
           <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
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
