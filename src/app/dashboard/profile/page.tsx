
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { getCookie, deleteCookie } from 'cookies-next';

import { getUserById, updateUser } from '@/app/actions';
import type { User } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Moon, Sun } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function UserProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();

  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Profile form state
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userId = getCookie('loggedInUserId');
      if (userId) {
        try {
          const userData = await getUserById(userId);
          if (userData) {
            setUser(userData);
            const nameParts = userData.name.split(' ');
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');
            setEmail(userData.email);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name: `${firstName} ${lastName}`.trim(),
      email: email,
    };
    await updateUser(updatedUser);
    toast({
      title: 'Success!',
      description: 'Personal information changed successfully.',
    });
    setUser(updatedUser); // Update local state to reflect changes
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.password !== currentPassword) {
      toast({ title: 'Incorrect Current Password', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 5) {
      toast({ title: 'New Password Too Short', description: 'Must be at least 5 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords Do Not Match', description: 'Please make sure your new passwords match.', variant: 'destructive' });
      return;
    }

    await updateUser({ ...user, password: newPassword });

    toast({ title: 'Password Updated Successfully', description: 'For your security, please log in again.' });

    // Log the user out after a successful password change
    setTimeout(() => {
      deleteCookie('loggedInUserId');
      router.push('/login');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription>We couldn't load your profile data. Your session may have expired.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold md:text-2xl mb-4">Profile & Settings</h1>
      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>

        <Separator />

        {/* Password Management */}
        <Card>
          <form onSubmit={handleUpdatePassword}>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you'll be logged out for security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button type="submit">Update Password</Button>
            </CardFooter>
          </form>
        </Card>

        <Separator />

        {/* Theme Switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Switch between light and dark mode.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="outline">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-2">Toggle Theme</span>
              </Button>
              <span className="text-sm text-muted-foreground">Current theme: {theme === 'light' ? 'Light' : 'Dark'}.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
