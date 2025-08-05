
"use client";

import * as React from 'react';
import { useParams } from 'next/navigation';
import { ReceiptBooking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Loader2, MapPin, Printer, User, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { placeholderBookings, placeholderPitches } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';


export default function ReceiptPage() {
    const params = useParams();
    const { toast } = useToast();
    const [booking, setBooking] = React.useState<ReceiptBooking | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const receiptRef = React.useRef<HTMLDivElement>(null);
    const bookingId = params.bookingId as string;
    
    React.useEffect(() => {
        if (!bookingId) {
            setIsLoading(false);
            return;
        }

        const loadBooking = () => {
            // In a real app, you'd fetch this from your database.
            // For this demo, we check localStorage first (for just-completed bookings)
            // and then the main placeholder data (for history).
            const storedBooking = localStorage.getItem('latestBooking');
            let foundBooking: ReceiptBooking | null = null;
            
            if (storedBooking) {
                const parsedBooking: ReceiptBooking = JSON.parse(storedBooking);
                if (parsedBooking.id === bookingId) {
                    foundBooking = parsedBooking;
                }
            }
            
            if (!foundBooking) {
                const historyBooking = placeholderBookings.find(b => b.id === bookingId);
                if (historyBooking) {
                    const pitch = placeholderPitches.find(p => p.name === historyBooking.pitchName);
                    // We need to augment the history booking with the extra details for the receipt.
                    // In a real app, this data would already be part of the booking object from the DB.
                    foundBooking = {
                        ...historyBooking,
                        pitchLocation: pitch?.location || 'N/A', // get location from pitch data
                        userName: historyBooking.customerName, // use the name from the booking
                        paymentMethod: 'Card', // Placeholder, ideally this is stored with the booking
                    };
                }
            }
            
            setBooking(foundBooking);
            setIsLoading(false);
        };

        loadBooking();

    }, [bookingId]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (!booking || !receiptRef.current) return;

        toast({ title: 'Generating image...', description: 'Please wait a moment.' });

        try {
            const canvas = await html2canvas(receiptRef.current, {
                useCORS: true, // Important for external images
                scale: 2 // Higher scale for better quality
            });
            
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast({ title: "Error", description: "Failed to generate image.", variant: "destructive" });
                    return;
                }

                const file = new File([blob], `receipt-${booking.id}.png`, { type: 'image/png' });
                const shareData = {
                    title: `Football Booking: ${booking.pitchName}`,
                    text: `We've booked ${booking.pitchName} on ${booking.date} at ${booking.time}. See you there!`,
                    files: [file],
                };

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    // Fallback for desktop or non-supporting browsers
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `receipt-${booking.id}.png`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    toast({
                        title: "Image Downloaded",
                        description: "Receipt image has been saved.",
                    });
                }
            }, 'image/png');

        } catch (error) {
            console.error("Error sharing:", error);
            toast({
                title: "Error",
                description: "Could not share the receipt image.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading your receipt...</p>
            </div>
        );
    }
    
    if (!booking) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <CardTitle>Booking Not Found</CardTitle>
                        <CardDescription>The booking receipt you are looking for does not exist or has expired.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                         <Button asChild variant="outline">
                            <Link href="/owner/dashboard/bookings">
                                <ArrowLeft className="mr-2 h-4 w-4" /> View All Bookings
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify({bookingId: booking.id, pitch: booking.pitchName, user: booking.userName, time: booking.time}))}`;
    
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4 print:hidden">
                <Button asChild variant="ghost">
                    <Link href="/owner/dashboard/bookings">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>
            
            <Card ref={receiptRef} className="p-2 print:shadow-none print:border-none bg-background">
                <CardHeader className="text-center bg-primary/5 rounded-t-lg p-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <CardTitle className="text-2xl mt-2">Booking Confirmed!</CardTitle>
                    <CardDescription>Payment was successful and the pitch is reserved.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">PITCH</h3>
                                <p className="text-lg font-bold">{booking.pitchName}</p>
                                <p className="text-sm text-muted-foreground flex items-center"><MapPin className="h-3 w-3 mr-1"/>{booking.pitchLocation}</p>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">BOOKED BY</h3>
                                <p className="font-medium flex items-center"><User className="h-3 w-3 mr-1"/>{booking.userName}</p>
                            </div>
                        </div>
                        <div className="flex sm:flex-col sm:items-end gap-4">
                             <Image 
                                src={qrCodeUrl}
                                alt="Booking QR Code"
                                width={120}
                                height={120}
                                className="rounded-md"
                             />
                             <div className="text-left sm:text-right">
                                <h3 className="text-sm font-semibold text-muted-foreground">BOOKING ID</h3>
                                <p className="font-mono text-sm">{booking.id}</p>
                                <p className="text-xs text-muted-foreground">Show QR code for verification</p>
                             </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">DATE</h3>
                            <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">TIME</h3>
                            <p className="font-medium">{booking.time}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">PAYMENT METHOD</h3>
                            <p className="font-medium">{booking.paymentMethod}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">STATUS</h3>
                            <p className="font-medium text-green-600">{booking.status}</p>
                        </div>
                    </div>
                    
                    <Separator className="my-6" />

                    <div className="flex justify-end items-center bg-muted/50 p-4 rounded-lg">
                         <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Paid</p>
                            <p className="text-2xl font-bold text-primary mt-1">₦{booking.amount.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground p-6">
                    <p>Thank you for booking with 9ja Pitch Connect. Please arrive at least 10 minutes before your scheduled time. This receipt is your proof of payment.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
