
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
import { Moon, Sun, LogOut, Loader2 } from 'lucide-react';
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
import { getUserById, updateUser } from '@/app/actions';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function UserProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  
  // State for form fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  React.useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      let userId = null;
      try {
        userId = localStorage.getItem('loggedInUserId');
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
      

      if (userId) {
        const user = await getUserById(userId);
        if (user) {
          setCurrentUser(user);
          setFirstName(user.name.split(' ')[0] || '');
          setLastName(user.name.split(' ').slice(1).join(' ') || '');
          setEmail(user.email);
        } else {
           // If user ID exists in storage but not in DB, it's an invalid session
           // We do not redirect here to avoid the flash of login page.
           // The UI will show a disabled state.
           setCurrentUser(null);
        }
      } else {
        // No user ID in storage, do not redirect, UI will be disabled.
        setCurrentUser(null);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const handleSaveChanges = async () => {
    if (!currentUser) {
        toast({ title: "Error", description: "Could not find user to update.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    
    const newName = `${firstName} ${lastName}`.trim();
    const updatedUser: User = { ...currentUser, name: newName, email };
    
    await updateUser(updatedUser);

    setIsSaving(false);
    toast({
      title: "Success!",
      description: "Your personal information has been updated.",
    });
  };

  const handleUpdatePassword = async () => {
    if (!currentUser) {
        toast({ title: "Error", description: "User not found.", variant: "destructive" });
        return;
    }
    if (newPassword.length < 5) {
      toast({ title: "Password Too Short", description: "New password must be at least 5 characters.", variant: "destructive"});
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords Do Not Match", description: "The new passwords do not match.", variant: "destructive"});
      return;
    }
    if (currentUser.password !== currentPassword) {
       toast({ title: "Incorrect Password", description: "The current password you entered is incorrect.", variant: "destructive"});
      return;
    }
    
    setIsUpdatingPassword(true);
    const updatedUser: User = { ...currentUser, password: newPassword };
    await updateUser(updatedUser);
    setIsUpdatingPassword(false);

    toast({
      title: "Password Successfully Changed",
      description: "Please log in again with your new password.",
    });

    setTimeout(() => {
        try {
            localStorage.removeItem('loggedInUserId');
        } catch (error) {
             console.error("Could not access localStorage:", error);
        }
        router.push('/login');
    }, 2000);
  };
  
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading || !currentUser} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading || !currentUser} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || !currentUser} />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleSaveChanges} disabled={isLoading || !currentUser || isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                    </Button>
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
                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isLoading || !currentUser}/>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading || !currentUser}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading || !currentUser}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" disabled={isLoading || !currentUser || isUpdatingPassword}>
                                {isUpdatingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
                            </Button>
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
