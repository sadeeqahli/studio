
"use client";

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
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun } from 'lucide-react';

export default function OwnerProfile() {
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();


  const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your profile information has been updated.",
    });
  };

  const handleUpdatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your password has been changed. You will be logged out shortly.",
    });
  };

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Owner Profile & Settings</h1>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>Update your personal and business details here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="owner-name">Full Name</Label>
                        <Input id="owner-name" defaultValue="Tunde Ojo" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="tunde.ojo@example.com" />
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
                <CardContent>
                     <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="outline">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="ml-2">{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
