
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


export default function OwnerDashboard() {
  const stats = [
    { title: "Total Revenue", value: "₦1,250,000", icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "+20.1% from last month" },
    { title: "New Bookings", value: "+52", icon: <Users className="h-4 w-4 text-muted-foreground" />, description: "+15 since last week" },
    { title: "Bookings this Month", value: "128", icon: <Calendar className="h-4 w-4 text-muted-foreground" />, description: "+8.5% from last month" },
    { title: "Active Pitches", value: "4", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />, description: "All pitches are online" },
  ];

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Dashboard Overview</h1>
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
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Recent bookings list will be displayed here.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pitch Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A chart showing pitch occupancy will be here.</p>
                </CardContent>
            </Card>
            <div className="xl:col-span-3">
               <CommissionCalculatorCard />
            </div>
        </div>
    </div>
  )
}
