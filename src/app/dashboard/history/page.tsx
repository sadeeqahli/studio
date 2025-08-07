
"use client";

import Link from "next/link";
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { placeholderBookings, placeholderCredentials } from "@/lib/placeholder-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Eye, Inbox } from "lucide-react";
import type { Booking } from "@/lib/types";

export default function BookingHistory() {
  const [userBookings, setUserBookings] = React.useState<Booking[]>([]);
  
  // In a real app, you'd get the current user's ID from a session or auth context.
  // For this prototype, we'll hardcode the user's name to filter their bookings.
  const currentUserName = "Max Robinson"; 

  React.useEffect(() => {
    // In a real app, you'd fetch this from the server based on the user's ID.
    // For the prototype, we filter the shared placeholder data.
    const filteredBookings = placeholderBookings.filter(
      booking => booking.customerName === currentUserName
    );
    setUserBookings(filteredBookings);
  }, []);

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Booking History</h1>
        <Card>
            <CardHeader>
                <CardTitle>Your Transactions</CardTitle>
                <CardDescription>A record of all your pitch bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Pitch Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userBookings.length > 0 ? (
                            userBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">
                                        {booking.id}
                                    </TableCell>
                                    <TableCell>{booking.pitchName}</TableCell>
                                    <TableCell>{booking.date} at {booking.time}</TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'Paid' ? 'default' : 'secondary'} 
                                            className={cn(
                                                'text-xs',
                                                booking.status === 'Paid' && 'bg-green-100 text-green-800 border-green-200',
                                                booking.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                                booking.status === 'Cancelled' && 'bg-red-100 text-red-800 border-red-200'
                                            )}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₦{booking.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        {booking.status === 'Paid' && (
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/dashboard/receipt/${booking.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Receipt
                                                </Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center">
                                    <Inbox className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">No Bookings Yet</h3>
                                    <p className="text-muted-foreground">You haven't made any bookings. Start by finding a pitch!</p>
                                     <Button asChild className="mt-4">
                                        <Link href="/dashboard">Find a Pitch</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}

    