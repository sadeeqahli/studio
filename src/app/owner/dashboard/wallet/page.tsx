
"use client";

import * as React from "react";
import html2canvas from "html2canvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Landmark, Loader2, ArrowUp, Copy, CheckCircle, Printer, Share2, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { Transaction, WithdrawalReceipt } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const banks = ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA", "Kuda MFB"];

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

function WithdrawalReceiptDialog({ receipt, isOpen, setIsOpen }: { receipt: WithdrawalReceipt | null, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const receiptRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    if (!receipt) return null;

     const handleShare = async () => {
        if (!receiptRef.current) return;
        toast({ title: 'Generating receipt image...' });
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2 });
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast({ title: "Error creating image", variant: "destructive" });
                    return;
                }
                const file = new File([blob], `withdrawal-receipt-${receipt.id}.png`, { type: 'image/png' });
                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Withdrawal Receipt',
                        text: `Withdrawal of ₦${receipt.amount.toLocaleString()} was successful.`,
                        files: [file],
                    });
                } else {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `withdrawal-receipt-${receipt.id}.png`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    toast({ title: "Receipt Downloaded" });
                }
            }, 'image/png');
        } catch (error) {
            console.error("Share error:", error);
            toast({ title: "Could not share receipt", variant: "destructive" });
        }
    };

    const handlePrint = () => {
        const content = receiptRef.current;
        if (content) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write('<html><head><title>Print Receipt</title>');
            // A very basic stylesheet for printing
            printWindow?.document.write('<style>body{font-family:sans-serif;padding:20px;} .receipt-card { border: 1px solid #ccc; border-radius: 8px; padding: 20px; } .header{text-align:center;margin-bottom:20px;} .details-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;} .footer{text-align:center;margin-top:20px;font-size:12px;color:#888;}</style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write(content.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.focus();
            printWindow?.print();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                 <div ref={receiptRef} className="bg-background p-4 rounded-lg">
                    <DialogHeader className="text-center items-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <DialogTitle className="text-2xl mt-2">Withdrawal Successful</DialogTitle>
                        <DialogDescription>
                            Funds have been successfully transferred to your bank account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 px-2 space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Amount Withdrawn</p>
                            <p className="text-3xl font-bold text-primary">₦{receipt.amount.toLocaleString()}</p>
                        </div>
                        <Separator />
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-mono">{receipt.id}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{new Date(receipt.date).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bank:</span>
                                <span>{receipt.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Number:</span>
                                <span>{receipt.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Account Name:</span>
                                <span>{receipt.accountName}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="font-semibold text-green-600">{receipt.status}</span>
                            </div>
                        </div>
                    </div>
                 </div>
                <DialogFooter className="print:hidden">
                    <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" />Share</Button>
                    <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Print</Button>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function WithdrawDialog({ onWithdraw }: { onWithdraw: (newTransaction: Transaction, receipt: WithdrawalReceipt) => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [amount, setAmount] = React.useState('');

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsOpen(false);
            
            const withdrawalAmount = parseFloat(amount);
            const transactionId = `TRN-${Date.now()}`;
            const receiptId = `WDR-${Date.now()}`;

            const newTransaction: Transaction = {
                id: transactionId,
                date: new Date().toISOString(),
                description: "Withdrawal to bank account",
                amount: -withdrawalAmount,
                type: 'Withdrawal',
            };

            const newReceipt: WithdrawalReceipt = {
                id: receiptId,
                date: new Date().toISOString(),
                amount: withdrawalAmount,
                bankName: "GTBank",
                accountNumber: "****6789",
                accountName: "Tunde Ojo",
                status: 'Successful'
            };
            
            onWithdraw(newTransaction, newReceipt);
            setAmount('');

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
                            <Input id="amount" type="number" placeholder="e.g., 50000" required value={amount} onChange={(e) => setAmount(e.target.value)} />
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
                            <Input id="account-number" required defaultValue="0123456789"/>
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
    const [transactions, setTransactions] = React.useState<Transaction[]>(placeholderTransactions);
    const [receipt, setReceipt] = React.useState<WithdrawalReceipt | null>(null);
    const [isReceiptOpen, setIsReceiptOpen] = React.useState(false);
    const { toast } = useToast();

    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const handleWithdraw = (newTransaction: Transaction, newReceipt: WithdrawalReceipt) => {
        if (Math.abs(newTransaction.amount) > totalBalance) {
            toast({
                title: "Insufficient Funds",
                description: "You do not have enough balance to withdraw that amount.",
                variant: "destructive"
            });
            return;
        }
        setTransactions(prev => [newTransaction, ...prev]);
        setReceipt(newReceipt);
        setIsReceiptOpen(true);
    };

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
                <WithdrawDialog onWithdraw={handleWithdraw} />
            </div>
            
            {receipt && <WithdrawalReceiptDialog receipt={receipt} isOpen={isReceiptOpen} setIsOpen={setIsReceiptOpen} />}

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalBalance.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Funds available for withdrawal.
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

            <PayoutScheduleCard />

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

    