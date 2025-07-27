
"use client";

import * as React from 'react';
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
import { placeholderPayouts } from "@/lib/placeholder-data";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { add, format } from 'date-fns';

type Schedule = "daily" | "weekly" | "bi-weekly" | "monthly";

export default function OwnerPayouts() {
    const [schedule, setSchedule] = React.useState<Schedule | null>(null);
    const [nextPayoutDate, setNextPayoutDate] = React.useState<Date | null>(null);
    const [scheduleUnlockDate, setScheduleUnlockDate] = React.useState<Date | null>(null);

    React.useEffect(() => {
        const savedSchedule = localStorage.getItem('payoutSchedule') as Schedule;
        const savedUnlockDate = localStorage.getItem('scheduleUnlockDate');
        
        if (savedSchedule) {
            setSchedule(savedSchedule);
        }
        if (savedUnlockDate) {
            const unlockDate = new Date(savedUnlockDate);
            if (unlockDate > new Date()) {
                setScheduleUnlockDate(unlockDate);

                if (savedSchedule) {
                    const now = new Date();
                    let nextDate = now;
                    if (savedSchedule === 'daily') nextDate = add(now, { days: 1 });
                    if (savedSchedule === 'weekly') nextDate = add(now, { weeks: 1 });
                    if (savedSchedule === 'bi-weekly') nextDate = add(now, { weeks: 2 });
                    if (savedSchedule === 'monthly') nextDate = add(now, { months: 1 });
                    setNextPayoutDate(nextDate);
                }
            } else {
                 localStorage.removeItem('payoutSchedule');
                 localStorage.removeItem('scheduleUnlockDate');
                 setSchedule(null);
                 setNextPayoutDate(null);
                 setScheduleUnlockDate(null);
            }
        }
    }, []);

    const handleScheduleChange = (newSchedule: Schedule) => {
        const now = new Date();
        let unlockDate: Date;
        let nextPayout: Date;

        switch (newSchedule) {
            case 'daily':
                unlockDate = add(now, { days: 1 });
                nextPayout = add(now, { days: 1 });
                break;
            case 'weekly':
                unlockDate = add(now, { weeks: 1 });
                nextPayout = add(now, { weeks: 1 });
                break;
            case 'bi-weekly':
                unlockDate = add(now, { weeks: 2 });
                nextPayout = add(now, { weeks: 2 });
                break;
            case 'monthly':
                unlockDate = add(now, { months: 1 });
                nextPayout = add(now, { months: 1 });
                break;
            default:
                return;
        }

        setSchedule(newSchedule);
        setScheduleUnlockDate(unlockDate);
        setNextPayoutDate(nextPayout);
        localStorage.setItem('payoutSchedule', newSchedule);
        localStorage.setItem('scheduleUnlockDate', unlockDate.toISOString());
    }

    const handleExport = () => {
        const headers = [
            "Booking ID",
            "Customer Name",
            "Gross Amount (NGN)",
            "Commission Rate (%)",
            "Commission Fee (NGN)",
            "Net Payout (NGN)",
            "Date",
            "Status"
        ];
        
        const rows = placeholderPayouts.map(payout => [
            `"${payout.bookingId}"`,
            `"${payout.customerName}"`,
            payout.grossAmount,
            payout.commissionRate,
            payout.commissionFee,
            payout.netPayout,
            `"${payout.date}"`,
            `"${payout.status}"`
        ]);

        let csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "payouts-report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isScheduleLocked = scheduleUnlockDate ? new Date() < scheduleUnlockDate : false;

    return (
        <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                 <h1 className="text-lg font-semibold md:text-2xl">Payouts</h1>
                 <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>
            
            <div className="grid gap-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending Payout</CardDescription>
                            <CardTitle className="text-3xl">₦16,200</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                Scheduled for next payout cycle
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Payout Schedule</CardDescription>
                            <CardTitle className="text-2xl">
                                <Select 
                                    value={schedule || ''} 
                                    onValueChange={(value) => handleScheduleChange(value as Schedule)}
                                    disabled={isScheduleLocked}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select schedule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="bi-weekly">Every 2 Weeks</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardTitle>
                        </CardHeader>
                         <CardContent>
                            <div className="text-xs text-muted-foreground">
                                {isScheduleLocked && scheduleUnlockDate && nextPayoutDate ? (
                                    <span className="flex items-center gap-1.5">
                                        <Lock className="h-3 w-3" />
                                        Next payout: {format(nextPayoutDate, 'dd MMM yyyy')}. You can change this on {format(scheduleUnlockDate, 'dd MMM yyyy')}.
                                    </span>
                                ) : (
                                    'Select a schedule to see your next payout date.'
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Deduction History</CardTitle>
                        <CardDescription>
                            A detailed record of all commissions deducted from your bookings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead className="hidden sm:table-cell">Gross Amount</TableHead>
                                    <TableHead className="hidden sm:table-cell">Commission</TableHead>
                                    <TableHead>Net Payout</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {placeholderPayouts.map((payout) => (
                                    <TableRow key={payout.bookingId}>
                                        <TableCell>
                                            <div className="font-medium">{payout.bookingId}</div>
                                            <div className="text-xs text-muted-foreground">{payout.customerName}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell font-mono">
                                            ₦{payout.grossAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="font-medium text-destructive">Platform Commission</div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                - ₦{payout.commissionFee.toLocaleString()} ({payout.commissionRate}%)
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono font-semibold text-primary">
                                            ₦{payout.netPayout.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{payout.date}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline"
                                                className={cn(
                                                    payout.status === 'Paid Out' && 'bg-green-100 text-green-800 border-green-200',
                                                    payout.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                )}
                                            >
                                                {payout.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
