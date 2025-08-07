
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
import { Moon, Sun, Loader2 } from 'lucide-react';
import { getUserById, updateUser } from '@/app/actions';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function UserProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  React.useEffect(() => {
    async function loadUser() {
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        const user = await getUserById(userId);
        if (user) {
          setCurrentUser(user);
          setFirstName(user.name.split(' ')[0] || '');
          setLastName(user.name.split(' ').slice(1).join(' ') || '');
          setEmail(user.email);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
    loadUser();
  }, [router]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const updatedUser: User = {
        ...currentUser,
        name: `${firstName} ${lastName}`,
        email: email,
    };
    
    await updateUser(updatedUser);
    setCurrentUser(updatedUser); // Update local state to reflect changes

    toast({
      title: "Success!",
      description: "Your personal information has been updated.",
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (currentUser.password !== currentPassword) {
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
        ...currentUser,
        password: newPassword,
    };

    await updateUser(updatedUser);
    
    toast({
      title: "Password Successfully Changed",
      description: "Please log in again with your new password.",
    });
    
    setTimeout(() => {
        localStorage.removeItem('loggedInUserId');
        router.push('/login');
    }, 2000);
  };
  
  if (!currentUser) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  const isInfoChanged = currentUser ? (firstName !== (currentUser.name.split(' ')[0] || '')) || (lastName !== (currentUser.name.split(' ').slice(1).join(' ') || '')) || (email !== currentUser.email) : false;
  
  const isPasswordFormValid = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Profile & Settings</h1>
        <div className="grid gap-6">
            <Card>
                <form onSubmit={handleSaveChanges}>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name..."/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name..."/>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address..." />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={!isInfoChanged}>Save Changes</Button>
                    </CardFooter>
                </form>
            </Card>

            <Separator />

            <Card>
                 <form onSubmit={handleUpdatePassword}>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={!isPasswordFormValid}>Update Password</Button>
                    </CardFooter>
                </form>
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
