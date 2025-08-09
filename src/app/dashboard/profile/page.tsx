
"use client";

import * as React from "react";
import { getUserById } from "@/app/actions";
import { PasswordForm } from "@/components/player/password-form";
import { ProfileForm } from "@/components/player/profile-form";
import { ThemeSwitcher } from "@/components/player/theme-switcher";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function UserProfile() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        const userData = await getUserById(userId);
        setUser(userData || null);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading profile...</p>
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
                    <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go to Login
                    </Link>
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
            <ProfileForm user={user} />

            <Separator />

            <PasswordForm user={user} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Switch between light and dark mode.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeSwitcher />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
