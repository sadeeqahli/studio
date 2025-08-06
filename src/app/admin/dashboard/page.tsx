
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, CalendarCheck, List } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { placeholderCredentials, placeholderPitches, placeholderBookings, placeholderPayouts } from "@/lib/placeholder-data"
import { User } from "@/lib/types"

const planPricing = {
    'Starter': 0,
    'Plus': 20000,
    'Pro': 40000
};

export default function AdminDashboard() {
  const totalUsers = placeholderCredentials.length;
  const totalPitches = placeholderPitches.length;
  const totalBookings = placeholderBookings.length;
  const totalRevenue = placeholderPayouts.reduce((acc, payout) => acc + payout.commissionFee, 0);

  const monthlyRecurringRevenue = placeholderCredentials
    .filter(user => user.role === 'Owner' && user.status === 'Active' && user.subscriptionPlan && planPricing[user.subscriptionPlan as keyof typeof planPricing])
    .reduce((acc, user) => acc + (planPricing[user.subscriptionPlan as keyof typeof planPricing] || 0), 0);
    
  const annualRecurringRevenue = monthlyRecurringRevenue * 12;

  const stats = [
    { title: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "All-time commission earned" },
    { title: "Total Users", value: totalUsers.toString(), icon: <Users className="h-4 w-4 text-muted-foreground" />, description: "Players and Owners" },
    { title: "Total Pitches", value: totalPitches.toString(), icon: <List className="h-4 w-4 text-muted-foreground" />, description: "Across all owners" },
    { title: "Total Bookings", value: totalBookings.toString(), icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />, description: "All-time bookings" },
  ];
  
  const recurringRevenueStats = [
      { title: "Monthly Recurring Revenue", value: `₦${monthlyRecurringRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "From owner subscriptions" },
      { title: "Annual Recurring Revenue", value: `₦${annualRecurringRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "Estimated from subscriptions" },
  ]

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Platform Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {stat.title}
                    </CardTitle>
                    {stat.icon}
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.description}
                    </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-4 mt-8">
             {recurringRevenueStats.map((stat, index) => (
                <Card key={index} className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {stat.title}
                    </CardTitle>
                    {stat.icon}
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.description}
                    </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>The latest users who signed up.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {placeholderCredentials.slice(0, 5).map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-right">
                                         <Badge
                                            variant={user.status === 'Active' ? 'default' : 'destructive'}
                                            className={cn(user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>The latest bookings made on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pitch</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {placeholderBookings.slice(0, 5).map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">{booking.pitchName}</div>
                                        <div className="text-sm text-muted-foreground">{booking.date} at {booking.time}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'Paid' ? 'default' : 'secondary'} 
                                            className={cn(
                                                booking.status === 'Paid' && 'bg-green-100 text-green-800 border-green-200',
                                                booking.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                booking.status === 'Cancelled' && 'bg-red-100 text-red-800 border-red-200'
                                            )}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₦{booking.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
