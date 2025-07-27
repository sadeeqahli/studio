
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
import { Badge } from "@/components/ui/badge"
import { placeholderTransactions, placeholderPayouts } from "@/lib/placeholder-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Banknote, Landmark, Loader2, Download, Building, ArrowDown, ArrowUp, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

function DepositDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Deposit Funds
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fund Your Wallet</DialogTitle>
                    <DialogDescription>
                        Deposit funds into your wallet using your unique virtual account number.
                    </DialogDescription>
                </DialogHeader>
                 <Card className="mt-4">
                    <CardContent className="pt-6 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Bank Name:</span>
                            <span className="font-semibold">Providus Bank (Virtual)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Name:</span>
                            <span className="font-semibold">Naija Pitch Connect - Tunde Ojo</span>
                        </div>
                            <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Number:</span>
                            <span className="font-semibold font-mono">9988776655</span>
                        </div>
                    </CardContent>
                </Card>
                <DialogFooter>
                    <DialogTrigger asChild><Button>Done</Button></DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function OwnerWalletPage() {
    const totalBalance = placeholderTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const { toast } = useToast();
    const VIRTUAL_ACCOUNT_NUMBER = "9988776655";

    const handleCopy = () => {
        navigator.clipboard.writeText(VIRTUAL_ACCOUNT_NUMBER);
        toast({
            title: "Copied!",
            description: "Account number copied to clipboard."
        });
    }

    const getTransactionDetails = (txId: string) => {
        const payout = placeholderPayouts.find(p => p.bookingId === txId.replace('Commission for booking ', ''));
        if (payout) {
            return `On booking of ₦${payout.grossAmount.toLocaleString()} at ${payout.commissionRate}% rate`;
        }
        const creditPayout = placeholderPayouts.find(p => p.bookingId === txId.replace('Booking payment from ', ''));
         if (creditPayout) {
            return `From customer: ${creditPayout.customerName}`;
        }
        return `To GTBank Account ending in 6789`;
    };

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">My Wallet</h1>
                <div className="flex gap-2">
                    <DepositDialog />
                    <WithdrawDialog />
                </div>
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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Virtual Account</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold font-mono">{VIRTUAL_ACCOUNT_NUMBER}</div>
                            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                                <span className="sr-only">Copy</span>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Providus Bank - For receiving booking payments.
                        </p>
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
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {placeholderTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="hidden md:table-cell">{tx.date}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {getTransactionDetails(tx.description)}
                                        </div>
                                        <div className="text-xs text-muted-foreground md:hidden">{tx.date}</div>
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
