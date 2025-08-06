
"use client";

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, Calendar, BarChart3, Calculator } from "lucide-react"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SubscriptionStatusCard } from '@/components/subscription-status-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { placeholderBookings, placeholderPitches } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';

function CommissionCalculatorCard() {
    const [bookingAmount, setBookingAmount] = React.useState<number | string>("");
    const [plan, setPlan] = React.useState("starter");

    const commissionRates = {
        starter: 10,
        plus: 5,
        pro: 3,
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBookingAmount(value === '' ? '' : parseFloat(value));
    };

    const amount = typeof bookingAmount === 'number' ? bookingAmount : 0;
    const commissionRate = commissionRates[plan as keyof typeof commissionRates];
    const commissionFee = (amount * commissionRate) / 100;
    const netPayout = amount - commissionFee;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Commission Calculator
                </CardTitle>
                <CardDescription>
                    Estimate your earnings based on your plan's commission rate.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="booking-amount">Booking Amount (₦)</Label>
                        <Input 
                            id="booking-amount" 
                            type="number" 
                            placeholder="e.g., 25000"
                            value={bookingAmount}
                            onChange={handleAmountChange}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="plan-select">Your Plan</Label>
                         <Select value={plan} onValueChange={setPlan}>
                            <SelectTrigger id="plan-select">
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="starter">Starter (10%)</SelectItem>
                                <SelectItem value="plus">Plus (5%)</SelectItem>
                                <SelectItem value="pro">Pro (3%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {amount > 0 && (
                    <div className="space-y-3 rounded-lg border p-4">
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Booking Amount</span>
                            <span className="font-semibold">₦{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Commission ({commissionRate}%)</span>
                            <span className="font-semibold text-destructive">- ₦{commissionFee.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between items-center text-lg">
                            <span className="font-bold">Net Payout</span>
                            <span className="font-bold text-primary">₦{netPayout.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function RecentBookingsCard() {
    return (
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>A quick look at your latest customer bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Pitch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderBookings.slice(0, 5).map((booking) => (
                             <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.customerName}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{booking.pitchName}</TableCell>
                                <TableCell>
                                     <Badge variant={booking.status === 'Paid' ? 'default' : 'secondary'} 
                                        className={cn(
                                            'text-xs',
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
    )
}


export default function OwnerDashboard() {
  // For prototype purposes, we'll assume the logged-in owner is 'Tunde Ojo'
  // In a real app, you'd get this from session/auth context.
  const ownerPitches = placeholderPitches
    .filter(p => ['Lekki AstroTurf', 'Ikeja 5-a-side'].includes(p.name))
    .map(p => p.name);

  const ownerBookings = placeholderBookings.filter(b => ownerPitches.includes(b.pitchName));
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const bookingsLast30Days = ownerBookings.filter(b => new Date(b.date) >= thirtyDaysAgo && b.status === 'Paid');
  
  const totalRevenue = ownerBookings.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.amount, 0);
  const monthlyRevenue = bookingsLast30Days.reduce((acc, b) => acc + b.amount, 0);
  const annualRevenue = monthlyRevenue * 12;
  const newBookingsThisMonth = bookingsLast30Days.length;

  const stats = [
    { title: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "All-time gross revenue" },
    { title: "Active Pitches", value: ownerPitches.length.toString(), icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />, description: "Your listed pitches" },
    { title: "Bookings this Month", value: newBookingsThisMonth.toString(), icon: <Calendar className="h-4 w-4 text-muted-foreground" />, description: "Paid bookings in last 30 days" },
  ];

  const recurringRevenueStats = [
      { title: "Monthly Revenue", value: `₦${monthlyRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "Based on last 30 days" },
      { title: "Projected Annual Revenue", value: `₦${annualRevenue.toLocaleString()}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "Estimated from monthly revenue" },
  ]


  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Dashboard Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 mt-8">
             {recurringRevenueStats.map((stat, index) => (
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

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
            <RecentBookingsCard />
            <SubscriptionStatusCard />
            <div className="lg:col-span-2 xl:col-span-3">
               <CommissionCalculatorCard />
            </div>
        </div>
    </div>
  )
}
