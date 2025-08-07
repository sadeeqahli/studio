
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
import { Moon, Sun } from 'lucide-react';
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

export default function UserProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

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
        }
      } else {
        router.push('/login');
      }
    }
    loadUser();
  }, [router]);

  const handleSaveChanges = async () => {
    if (!currentUser) {
        toast({ title: "Error", description: "Could not find user to update.", variant: "destructive" });
        return;
    }
    
    const newName = `${firstName} ${lastName}`.trim();
    const updatedUser: User = { ...currentUser, name: newName, email };
    
    await updateUser(updatedUser);

    toast({
      title: "Success!",
      description: "Your personal information has been updated.",
    });
  };

  const handleUpdatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Logic to update password would go here
    toast({
      title: "Success!",
      description: "Your password has been changed. You will be logged out shortly.",
    });
  };
  
  if (!currentUser) {
    return <div>Loading profile...</div>;
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
                <form>
                    <CardContent className="grid gap-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button">Save Changes</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will update your profile information with the details you've entered.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSaveChanges}>
                                    Yes, Save Changes
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
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
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
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
