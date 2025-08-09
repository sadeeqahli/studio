
"use client";

import * as React from "react";
import { getUserById } from "@/app/actions";
import { PasswordForm } from "@/components/player/password-form";
import { ProfileForm } from "@/components/player/profile-form";
import { ThemeSwitcher } from "@/components/player/theme-switcher";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { User } from "@/lib/types";
import { Loader2 } from "lucide-react";


export default function UserProfile() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
        }
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
    return notFound();
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
