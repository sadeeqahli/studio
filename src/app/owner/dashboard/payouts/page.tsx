

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
import { placeholderPayouts, placeholderPitches, placeholderPayoutsToOwners } from "@/lib/placeholder-data";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, DollarSign, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Payout, OwnerWithdrawal } from '@/lib/types';


export default function OwnerPayouts() {
    const { toast } = useToast();
    const currentOwnerId = 'USR002'; // Hardcoded for prototype

    const ownerPitchNames = placeholderPitches
        .filter(p => p.ownerId === currentOwnerId)
        .map(p => p.name);

    const ownerPayouts = placeholderPayouts.filter(p => {
        // Find the pitch associated with the booking
        const bookingPitch = placeholderPitches.find(pitch => pitch.name === p.customerName.split('(').pop()?.split(')')[0]);
        // A more robust check might be needed if customerName format changes
        const pitchForBooking = placeholderPitches.find(pitch => pitch.name === p.customerName);

        // Check if the pitch belongs to the current owner
        return ownerPitchNames.includes(p.customerName);
    });

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
        
        const rows = ownerPayouts.map(payout => [
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
    
    const totalNetCredited = ownerPayouts
        .filter(p => p.status === 'Paid Out')
        .reduce((acc, p) => acc + p.netPayout, 0);

    const totalWithdrawn = placeholderPayoutsToOwners.filter(w => w.ownerName === "Tunde Ojo").reduce((acc, w) => acc + w.amount, 0);

    const totalNetPayout = totalNetCredited - totalWithdrawn;


    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                 <h1 className="text-lg font-semibold md:text-2xl">Payout History</h1>
                 <Button onClick={handleExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </div>
            
            <div className="grid md:grid-cols-1 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Net Payout</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalNetPayout.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total earnings paid out to you after commission.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Net Payout History</CardTitle>
                    <CardDescription>
                       A detailed record of all net payouts made to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {placeholderPayoutsToOwners.filter(w => w.ownerName === "Tunde Ojo").map((withdrawal: OwnerWithdrawal) => (
                                <TableRow key={withdrawal.id}>
                                    <TableCell>{new Date(withdrawal.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                         <div className="font-medium">Withdrawal to Bank</div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-semibold text-destructive">
                                        - ₦{withdrawal.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className='bg-green-100 text-green-800 border-green-200'>{withdrawal.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Commission Breakdown</CardTitle>
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
                            {ownerPayouts.map((payout) => (
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
