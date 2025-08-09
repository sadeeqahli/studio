
import * as React from "react";
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
import { cn } from "@/lib/utils"
import { Landmark, ArrowUp, Copy, CheckCircle, Printer, Share2, Lock } from "lucide-react"
import Link from "next/link";
import type { Transaction, Payout, OwnerWithdrawal, User } from "@/lib/types";
import { getPayoutsByOwner, getOwnerWithdrawals, getUserById } from "@/app/actions";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { notFound } from "next/navigation";
import { WalletClient } from "@/components/owner/wallet-client";


async function getWalletData(ownerId: string) {
    const owner = await getUserById(ownerId);
    if (!owner) {
        return null;
    }

    const [payoutsData, withdrawalsData] = await Promise.all([
        getPayoutsByOwner(owner.name),
        getOwnerWithdrawals(owner.name)
    ]);

    const creditTransactions: Transaction[] = payoutsData
        .filter(payout => payout.status === 'Paid Out')
        .map(payout => ({
            id: `TRN-CR-${payout.bookingId}`,
            date: payout.date,
            description: `Credit from booking by ${payout.customerName}`,
            amount: payout.netPayout,
            type: 'Credit',
            bookingId: payout.bookingId,
        }));

    const debitTransactions: Transaction[] = withdrawalsData.map(w => ({
        id: `TRN-DB-${w.id}`,
        date: w.date,
        description: "Withdrawal to bank account",
        amount: -w.amount,
        type: 'Withdrawal'
    }));

    const transactions = [...creditTransactions, ...debitTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    
    return { owner, transactions, totalBalance };
}

export default async function OwnerWalletPage() {
    const ownerId = getCookie('loggedInUserId', { cookies });
    if (!ownerId) {
        notFound();
    }

    const walletData = await getWalletData(ownerId);

    if (!walletData) {
        notFound();
    }

    const { owner, transactions, totalBalance } = walletData;

    return (
        <div className="grid gap-6">
            <WalletClient owner={owner} totalBalance={totalBalance} initialTransactions={transactions} />

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        A record of all movements in your wallet.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="hidden md:table-cell">{new Date(tx.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground md:hidden">{new Date(tx.date).toLocaleDateString()}</div>
                                        {tx.bookingId && (
                                            <Link href={`/owner/dashboard/bookings`}>
                                                <p className="text-xs text-primary hover:underline">View Booking: {tx.bookingId}</p>
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        <span className={cn(
                                            tx.amount > 0 ? "text-green-600" : "text-destructive"
                                        )}>
                                            {tx.amount > 0 ? `+ ₦${tx.amount.toLocaleString()}` : `- ₦${Math.abs(tx.amount).toLocaleString()}`}
                                        </span>
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
