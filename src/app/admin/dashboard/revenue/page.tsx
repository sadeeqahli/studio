
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign } from "lucide-react"
import { getPayouts } from "@/app/actions"
import type { Payout } from "@/lib/types"


export default function AdminRevenuePage() {
  const [payouts, setPayouts] = React.useState<Payout[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const payoutsData = await getPayouts();
      setPayouts(payoutsData);
    }
    loadData();
  }, []);
  
  const chartData = payouts.reduce((acc, payout) => {
    const date = new Date(payout.date).toLocaleDateString('en-CA'); // Format to YYYY-MM-DD for grouping
    const dailyRevenue = payout.commissionFee;
    const existing = acc.find(item => item.date === date);
    if (existing) {
        existing.revenue += dailyRevenue;
    } else {
        acc.push({ date, revenue: dailyRevenue });
    }
    return acc;
  }, [] as {date: string, revenue: number}[]).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const totalRevenue = payouts.reduce((acc, payout) => acc + payout.commissionFee, 0);
  const pendingCommission = payouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.commissionFee, 0);

  return (
    <div className="grid gap-6">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
        </div>

         <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        All-time commission fees earned.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
                     <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{pendingCommission.toLocaleString()}</div>
                     <p className="text-xs text-muted-foreground">
                        From payouts that have not yet been processed.
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Commission revenue earned per day.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short'})}
                        />
                        <YAxis 
                            tickFormatter={(value) => `₦${Number(value).toLocaleString()}`}
                        />
                        <Tooltip 
                             contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                             formatter={(value, name, props) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                        />
                        <Legend formatter={(value) => <span className="capitalize">{value}</span>} />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Daily Revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>
                A detailed record of all commissions from owner bookings.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Gross Booking</TableHead>
                    <TableHead className="hidden sm:table-cell">Commission Earned</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {payouts.map((payout) => (
                    <TableRow key={payout.bookingId}>
                        <TableCell className="font-medium">{payout.bookingId}</TableCell>
                        <TableCell className="hidden sm:table-cell font-mono">
                            ₦{payout.grossAmount.toLocaleString()}
                        </TableCell>
                         <TableCell className="hidden sm:table-cell font-mono text-primary font-semibold">
                            + ₦{payout.commissionFee.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{payout.ownerName}</TableCell>
                        <TableCell>{payout.date}</TableCell>
                        <TableCell className="text-right">
                             <Badge variant="outline"
                                className={cn(
                                    payout.status === 'Paid Out' && 'bg-green-100 text-green-800 border-green-200',
                                    payout.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                )}
                            >
                                {payout.status === 'Paid Out' ? 'Received' : 'Pending'}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}
