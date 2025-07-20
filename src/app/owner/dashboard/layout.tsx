
"use client"

import Link from "next/link"
import {
  Bell,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Goal,
  CalendarCheck2,
  List,
  DollarSign,
  BarChartHorizontalBig,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/icons"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear the user's session here
    router.push('/login');
  };

  const isSubscriptionPage = pathname.includes('/pricing') || pathname.includes('/subscribe');

  const navItems = [
    { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/owner/dashboard/pitches", label: "My Pitches", icon: List },
    { href: "/owner/dashboard/bookings", label: "Bookings", icon: CalendarCheck2 },
    { href: "/owner/dashboard/payouts", label: "Payouts", icon: BarChartHorizontalBig },
    { href: "/owner/dashboard/pricing", label: "Subscription", icon: DollarSign },
    { href: "/owner/dashboard/profile", label: "Profile", icon: UserCircle },
  ];

  if (isSubscriptionPage) {
    return (
        <div className="flex flex-col min-h-screen bg-primary/5">
             <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between">
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Logo className="h-8 w-8" />
                    <span className="text-lg text-primary">Naija Pitch Connect</span>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </header>
            <main className="flex-1 flex flex-col justify-center items-center p-4 lg:p-6">
                {children}
            </main>
        </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8" />
              <span className="text-lg text-primary">Naija Pitch Connect</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/> Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Goal className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo className="h-8 w-8" />
                  <span className="text-lg text-primary">Naija Pitch..</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Button size="sm" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/> Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <p className="font-semibold">Owner Dashboard</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/owner/dashboard/profile')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.location.href = 'mailto:support@naijapitchconnect.com'}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-primary/5">
          {children}
        </main>
      </div>
    </div>
  );
}
