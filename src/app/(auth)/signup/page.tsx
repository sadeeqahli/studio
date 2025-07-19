import Link from "next/link"
import { ArrowRight, User, Shield } from "lucide-react"

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
        <CardTitle className="text-2xl">Join Naija Pitch Connect</CardTitle>
        <CardDescription>
          Are you here to play or to list a pitch?
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
                <h3 className="text-lg font-semibold">I want to play</h3>
                <p className="text-sm text-muted-foreground">
                  Find and book football pitches.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/signup/owner" passHref>
          <Card className="hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">I own a pitch</h3>
                <p className="text-sm text-muted-foreground">
                  List your pitch and manage bookings.
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
      </CardContent>
    </Card>
  )
}
