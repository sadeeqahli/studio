import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThemeSwitcher } from "@/components/owner/theme-switcher"
import { AccountActions } from "@/components/owner/account-actions"
import { ProfileForm } from "@/components/owner/profile-form"
import { PasswordForm } from "@/components/owner/password-form"
import { PinManagementCard } from "@/components/owner/pin-management-card"
import { getUserById } from "@/app/actions"
import { getCookie } from "cookies-next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export default async function OwnerProfile() {
  const ownerId = getCookie('loggedInUserId', { cookies });

  if (!ownerId) {
    // This can happen if the cookie expires or is cleared.
    // Redirecting to login is a good practice here, but for now, we'll show not found.
    notFound();
  }

  const owner = await getUserById(ownerId);

  if (!owner) {
    notFound();
  }

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Owner Profile & Settings</h1>
        <div className="grid gap-6">
            <ProfileForm user={owner} />
            <PasswordForm user={owner} />
            <PinManagementCard />
            <ThemeSwitcher />
            <AccountActions />
        </div>
    </div>
  )
}
