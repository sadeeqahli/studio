
"use client";

import * as React from "react";
import { getUserById } from "@/app/actions";
import { PasswordForm } from "@/components/player/password-form";
import { ProfileForm } from "@/components/player/profile-form";
import { ThemeSwitcher } from "@/components/player/theme-switcher";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function UserProfile() {
  const [user, setUser] = React.useState<User | null>(null);
  
  // This now happens on the client, preventing the server-side crash.
  // The UI will render instantly, and the data will populate once fetched.
  React.useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        const userData = await getUserById(userId);
        setUser(userData || null);
      }
    };

    fetchUser();
  }, []);

  // While user data is loading, we can show a skeleton or disabled form.
  // This avoids the "loading..." message and makes the page feel faster.
  if (!user) {
    return (
      <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Profile & Settings</h1>
        <div className="grid gap-6">
          <Card>
              <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              </CardContent>
          </Card>
           <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </CardContent>
            </Card>
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
  
  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Profile & Settings</h1>
        <div className="grid gap-6">
            <ProfileForm user={user} />
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
