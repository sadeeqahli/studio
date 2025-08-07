
"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, LogOut } from 'lucide-react';
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
import { getUserById } from '@/app/actions';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  
  React.useEffect(() => {
    async function loadUser() {
      // In a real app, you'd get this from your auth context/session
      let userId = null;
      try {
        userId = localStorage.getItem('loggedInUserId');
      } catch (error) {
        // Handle cases where localStorage is not available (e.g., SSR)
        console.error("Could not access localStorage:", error);
      }
      
      if (userId) {
        const user = await getUserById(userId);
        setCurrentUser(user || null);
      } else {
        // If no user ID is found, redirect to login
        router.push('/login');
      }
    }
    loadUser();
  }, [router]);


  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your personal information has been updated.",
    });
  };

  const handleUpdatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Password Successfully Changed",
      description: "Please log in again with your new password.",
    });
    // In a real app, you'd also update the password in the backend here
    // and then perform the logout.
    setTimeout(() => {
        try {
            localStorage.removeItem('loggedInUserId');
        } catch (error) {
             console.error("Could not access localStorage:", error);
        }
        router.push('/login');
    }, 2000);
  };
  
  if (!currentUser) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Loading profile...</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Please wait while we fetch your details.</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Profile & Settings</h1>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue={currentUser.name.split(' ')[0]} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue={currentUser.name.split(' ').slice(1).join(' ')} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email} />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button">Update Password</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be logged out after successfully changing your password. Are you sure you want to continue?
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleUpdatePassword}>
                                Yes, Change Password
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Switch between light and dark mode.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <span className="text-sm text-muted-foreground">{theme === 'light' ? 'Current theme: Light' : 'Current theme: Dark'}.</span>
                     <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
