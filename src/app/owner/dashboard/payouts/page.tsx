

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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


function PayoutScheduleCard() {
    const { toast } = useToast();
    const [schedule, setSchedule] = React.useState("weekly");
    const [isLocked, setIsLocked] = React.useState(false);
    const [unlockDate, setUnlockDate] = React.useState<Date | null>(null);

    const handleSaveSchedule = () => {
        setIsLocked(true);
        const nextUnlockDate = new Date();
        nextUnlockDate.setDate(nextUnlockDate.getDate() + 30); // Lock for 30 days
        setUnlockDate(nextUnlockDate);
        toast({
            title: "Payout Schedule Saved!",
            description: `Your payout schedule is set to ${schedule}. You can change it again after ${nextUnlockDate.toLocaleDateString()}.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Automatic Payouts</CardTitle>
                <CardDescription>
                    Choose how often you want to receive your earnings automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="payout-frequency">Payout Frequency</Label>
                    <Select
                        value={schedule}
                        onValueChange={setSchedule}
                        disabled={isLocked}
                    >
                        <SelectTrigger id="payout-frequency">
                            <SelectValue placeholder="Select a schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Every 2 Weeks</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleSaveSchedule} disabled={isLocked} className="w-full">
                    {isLocked ? "Schedule Locked" : "Save Schedule"}
                </Button>
                 {isLocked && unlockDate && (
                    <Alert>
                        <Lock className="h-4 w-4" />
                        <AlertTitle>Schedule Locked</AlertTitle>
                        <AlertDescription>
                            Your payout schedule is locked to prevent frequent changes. You can select a new schedule after {unlockDate.toLocaleDateString()}.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

export default function OwnerPayouts() {

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

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                 <h1 className="text-lg font-semibold md:text-2xl">Payouts</h1>
                 <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>

            <PayoutScheduleCard />
            
            <Card>
                <CardHeader>
                    <CardTitle>Commission History</CardTitle>
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
    );
}
