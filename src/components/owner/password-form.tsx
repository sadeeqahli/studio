
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from '@/app/actions';
import type { User } from '@/lib/types';
import { deleteCookie } from 'cookies-next';

export function PasswordForm({ user }: { user: User }) {
    const { toast } = useToast();
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // In a real app, this check would be against a hashed password.
        if (user.password !== currentPassword) {
            toast({ title: "Incorrect Current Password", description: "The current password you entered is not correct.", variant: "destructive"});
            return;
        }

        if (newPassword.length < 5) {
            toast({ title: "New Password Too Short", description: "Your new password must be at least 5 characters long.", variant: "destructive"});
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords do not match", description: "Your new password and confirmation do not match.", variant: "destructive"});
            return;
        }
        
        const updatedUser: User = {
            ...user,
            password: newPassword,
        };

        await updateUser(updatedUser);
        
        toast({
        title: "Password Successfully Changed",
        description: "Please log in again with your new password.",
        });
        
        // Log the user out after a successful password change
        setTimeout(() => {
            deleteCookie('loggedInUserId');
            router.push('/login?type=owner');
        }, 2000);
    };

    const isPasswordFormValid = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

    return (
        <Card>
            <form onSubmit={handleUpdatePassword}>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                        <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={!isPasswordFormValid}>Update Password</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
