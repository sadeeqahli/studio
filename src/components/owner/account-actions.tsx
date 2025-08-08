"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, LogOut } from 'lucide-react';
import { deleteCookie } from 'cookies-next';

export function AccountActions() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = () => {
        deleteCookie('loggedInUserId');
        localStorage.removeItem('loggedInUserId');
        toast({ title: "Logged Out", description: "You have been successfully logged out."});
        router.push('/login?type=owner');
    };

    const handleDeactivate = () => {
        // In a real app, this would be an API call to delete the user.
        toast({
            title: "Account Deactivated",
            description: "Your account has been permanently deleted.",
            variant: "destructive",
        });
        deleteCookie('loggedInUserId');
        localStorage.removeItem('loggedInUserId');
        router.push('/');
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your session and account status.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                    <Button onClick={handleLogout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Deactivate Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and cannot be undone. This will permanently delete your account, your pitches, and all associated data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeactivate}>Yes, Deactivate Account</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
                <CardFooter className="border-t pt-6">
                <p className="text-xs text-muted-foreground">
                    Deactivating your account will remove all your data. If you wish to use our service again in the future, you will need to create a new account.
                </p>
                </CardFooter>
        </Card>
    );
}
