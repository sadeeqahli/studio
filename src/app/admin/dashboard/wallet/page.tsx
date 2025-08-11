
"use client";

import * as React from "react";
import html2canvas from 'html2canvas';
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
import { Button } from "@/components/ui/button"
import { Banknote, Landmark, Loader2, Download, Building, ShieldCheck, CheckCircle, Printer, Share2, DollarSign, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import type { AdminWithdrawal, WithdrawalReceipt, Payout, OwnerWithdrawal } from "@/lib/types";
import { getPayouts, getOwnerWithdrawals, getAdminWithdrawals, addAdminWithdrawal } from "@/app/actions";

const banks = ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA", "Kuda MFB"];

function WithdrawalReceiptDialog({ receipt, isOpen, setIsOpen }: { receipt: WithdrawalReceipt | null, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const receiptRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        if (receipt) {
            setFormattedDate(new Date(receipt.date).toLocaleString());
        }
    }, [receipt]);


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
                                <span>{formattedDate}</span>
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


function WithdrawDialog({ onWithdraw, availableBalance }: { onWithdraw: (receipt: WithdrawalReceipt) => void, availableBalance: number }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [amount, setAmount] = React.useState('');

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const withdrawalAmount = parseFloat(amount);
        if (!withdrawalAmount || withdrawalAmount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount to withdraw.",
                variant: "destructive",
            });
            return;
        }

        if (withdrawalAmount > availableBalance) {
            toast({
                title: "Insufficient funds",
                description: `You cannot withdraw more than the available balance of ₦${availableBalance.toLocaleString()}`,
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        const newWithdrawal: AdminWithdrawal = {
            id: `WDR-ADM-${Date.now()}`,
            date: new Date().toISOString(),
            amount: withdrawalAmount,
            bankName: "GTBank",
            accountNumber: "****6789",
            status: 'Successful',
            ownerName: 'Admin',
        };
        
        await addAdminWithdrawal(newWithdrawal);
        
        const newReceipt: WithdrawalReceipt = {
            ...newWithdrawal,
            accountName: 'LinkHub Inc.',
        };
        
        onWithdraw(newReceipt);
        
        setIsLoading(false);
        setIsOpen(false);
        setAmount('');

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Withdraw Funds
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Transfer funds from your platform wallet to your bank account.
                        Available for withdrawal: ₦{availableBalance.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWithdraw}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (NGN)</Label>
                            <Input id="amount" type="number" placeholder="e.g., 50000" required value={amount} onChange={e => setAmount(e.target.value)} />
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
                            <Input id="account-number" defaultValue="0123456789" required />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input id="account-name" value="LinkHub Inc." disabled />
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

function HistoryRow({ withdrawal }: { withdrawal: AdminWithdrawal }) {
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');

    React.useEffect(() => {
        const d = new Date(withdrawal.date);
        setDate(d.toLocaleDateString());
        setTime(d.toLocaleTimeString());
    }, [withdrawal.date]);
    
    const isOwnerPayout = withdrawal.ownerName !== 'Admin';

    return (
        <TableRow>
            <TableCell>
                {date ? (
                    <div>
                        <div className="font-medium">{date}</div>
                        <div className="text-xs text-muted-foreground">{time}</div>
                    </div>
                ) : (
                    <div className="font-medium">...</div>
                )}
            </TableCell>
            <TableCell>
                 <div className="font-medium">{isOwnerPayout ? 'Payout to Owner' : 'Admin Withdrawal'}</div>
                 <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3"/> {withdrawal.ownerName}
                 </div>
            </TableCell>
            <TableCell className="font-mono font-semibold">
                ₦{withdrawal.amount.toLocaleString()}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
                {withdrawal.bankName} ({withdrawal.accountNumber})
            </TableCell>
            <TableCell className="text-right">
                <Badge variant="outline" className='bg-green-100 text-green-800 border-green-200'>
                    {withdrawal.status}
                </Badge>
            </TableCell>
        </TableRow>
    );
}

function CommissionRow({ payout }: { payout: Payout }) {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        setFormattedDate(new Date(payout.date).toLocaleDateString());
    }, [payout.date]);

    return (
         <TableRow>
            <TableCell>
                <div className="font-medium">{payout.bookingId}</div>
                <div className="text-xs text-muted-foreground">From {payout.customerName}</div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
                Commission ({payout.commissionRate}%) on ₦{payout.grossAmount.toLocaleString()} booking
            </TableCell>
            <TableCell className="font-mono font-semibold text-primary">
                + ₦{payout.commissionFee.toLocaleString()}
            </TableCell>
            <TableCell className="hidden md:table-cell">{formattedDate || '...'}</TableCell>
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
    );
}


export default function AdminWalletPage() {
    const [allPayouts, setAllPayouts] = React.useState<Payout[]>([]);
    const [adminWithdrawals, setAdminWithdrawals] = React.useState<AdminWithdrawal[]>([]);
    const [ownerWithdrawals, setOwnerWithdrawals] = React.useState<OwnerWithdrawal[]>([]);
    const [receipt, setReceipt] = React.useState<WithdrawalReceipt | null>(null);
    const [isReceiptOpen, setIsReceiptOpen] = React.useState(false);
    
    React.useEffect(() => {
        async function loadData() {
            const [payoutsData, ownerWithdrawalsData, adminWithdrawalsData] = await Promise.all([
                getPayouts(),
                getOwnerWithdrawals('all'),
                getAdminWithdrawals()
            ]);
            setAllPayouts(payoutsData);
            setOwnerWithdrawals(ownerWithdrawalsData);
            setAdminWithdrawals(adminWithdrawalsData);
        }
        loadData();
    }, []);

    const allWithdrawals = [...adminWithdrawals, ...ownerWithdrawals.map(p => ({...p, id: `OWNER-${p.id}`, bankName: 'Various', accountNumber: 'Various'} as AdminWithdrawal))]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalRevenue = allPayouts.reduce((acc, payout) => acc + payout.commissionFee, 0);

    const totalWithdrawnByAdmin = adminWithdrawals.reduce((acc, w) => acc + w.amount, 0);
    const totalPaidToOwners = ownerWithdrawals.reduce((acc, w) => acc + w.amount, 0);

    const availableForWithdrawal = totalRevenue - totalPaidToOwners - totalWithdrawnByAdmin;

    const handleWithdraw = (newReceipt: WithdrawalReceipt) => {
        const newWithdrawal: AdminWithdrawal = {
            id: newReceipt.id,
            date: newReceipt.date,
            amount: newReceipt.amount,
            bankName: newReceipt.bankName,
            accountNumber: newReceipt.accountNumber,
            status: 'Successful',
            ownerName: 'Admin',
        };
        setAdminWithdrawals(prev => [newWithdrawal, ...prev]);
        setReceipt(newReceipt);
        setIsReceiptOpen(true);
    };

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Platform Wallet</h1>
                <WithdrawDialog onWithdraw={handleWithdraw} availableBalance={availableForWithdrawal} />
            </div>

            {receipt && <WithdrawalReceiptDialog receipt={receipt} isOpen={isReceiptOpen} setIsOpen={setIsReceiptOpen} />}


            <div className="grid md:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Landmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total commission earned all-time.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(totalPaidToOwners + totalWithdrawnByAdmin).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                           Amount paid to owners and withdrawn by admin.
                        </p>
                    </CardContent>
                </Card>
                 <Card className="md:col-span-1 bg-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available for Withdrawal</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">₦{availableForWithdrawal.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            The current balance you can withdraw.
                        </p>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Withdrawal & Payout History</CardTitle>
                    <CardDescription>
                        A record of all payouts to owners and withdrawals by admin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type/Recipient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="hidden sm:table-cell">Bank</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allWithdrawals.map((withdrawal) => (
                                <HistoryRow key={withdrawal.id} withdrawal={withdrawal} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Commission History</CardTitle>
                    <CardDescription>
                        A record of all commissions earned by the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead className="hidden sm:table-cell">Details</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allPayouts.map((payout) => (
                               <CommissionRow key={payout.bookingId} payout={payout} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
