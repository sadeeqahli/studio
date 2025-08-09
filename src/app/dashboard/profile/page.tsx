
import { getUserById } from "@/app/actions";
import { PasswordForm } from "@/components/player/password-form";
import { ProfileForm } from "@/components/player/profile-form";
import { ThemeSwitcher } from "@/components/player/theme-switcher";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";


export default async function UserProfile() {
  const userId = getCookie('loggedInUserId', { cookies });

  if (!userId) {
    // This can happen if the cookie expires or is cleared.
    notFound();
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound();
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
