
"use client";

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
import { placeholderTransactions } from "@/lib/placeholder-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Landmark, Loader2, ArrowUp, Copy, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const banks = ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA", "Kuda MFB"];

function WithdrawDialog() {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsOpen(false);
            toast({
                title: "Withdrawal Initiated",
                description: "Funds will be transferred to your bank account within 24 hours."
            });
        }, 1500);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Withdraw Funds
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Transfer funds from your platform wallet to your linked bank account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWithdraw}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (NGN)</Label>
                            <Input id="amount" type="number" placeholder="e.g., 50000" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank">Bank Name</Label>
                             <Select required defaultValue="GTBank">
                                <SelectTrigger id="bank">
                                    <SelectValue placeholder="Select a bank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks.map(bank => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input id="account-number" placeholder="0123456789" required defaultValue="0123456789"/>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input id="account-name" value="Tunde Ojo" disabled />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="pin">Transaction PIN</Label>
                            <Input id="pin" type="password" placeholder="Enter your 4-digit PIN" required maxLength={4}/>
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Confirm Withdrawal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function OwnerWalletPage() {
    const totalBalance = placeholderTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const { toast } = useToast();

    const virtualAccount = {
        number: "9988776655",
        bank: "Providus Bank",
        name: "9ja Pitch Connect - Tunde Ojo"
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(virtualAccount.number);
        toast({
            title: "Copied!",
            description: "Virtual account number copied to clipboard.",
        });
    };

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">My Wallet</h1>
                <WithdrawDialog />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalBalance.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Funds available for withdrawal or use on the platform.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Your Virtual Account</CardTitle>
                        <CardDescription>For receiving booking payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-mono font-semibold">{virtualAccount.number}</span>
                             <Button variant="ghost" size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4"/>
                                <span className="sr-only">Copy Account Number</span>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{virtualAccount.name} - {virtualAccount.bank}</p>
                    </CardContent>
                </Card>
            </div>

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
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {placeholderTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="hidden md:table-cell">{tx.date}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground md:hidden">{tx.date}</div>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        <span className={cn(
                                            tx.amount > 0 ? "text-green-600" : "text-destructive"
                                        )}>
                                            {tx.amount > 0 ? `+ ₦${tx.amount.toLocaleString()}` : `- ₦${Math.abs(tx.amount).toLocaleString()}`}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.bookingId && (
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/owner/dashboard/receipt/${tx.bookingId}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Receipt
                                                </Link>
                                            </Button>
                                        )}
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
