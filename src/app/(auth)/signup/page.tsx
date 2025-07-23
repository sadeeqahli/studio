
import Link from "next/link"
import { ArrowRight, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Your Player Account</CardTitle>
        <CardDescription>
          Sign up to find and book the best football pitches in Nigeria.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Link href="/signup/user" passHref>
          <Card className="hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Get Started</h3>
                <p className="text-sm text-muted-foreground">
                  Proceed to create your player profile.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
         <div className="text-center text-xs text-muted-foreground">
          Are you a pitch owner?{" "}
          <Link href="/signup/owner" className="underline">
            List your pitch here
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  )
}
