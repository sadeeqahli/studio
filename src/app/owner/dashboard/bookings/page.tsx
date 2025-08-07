

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
import { cn } from "@/lib/utils"
import { placeholderBookings, placeholderPitches } from "@/lib/placeholder-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Inbox } from "lucide-react"
import type { Booking } from '@/lib/types';


export default function OwnerBookings() {
  const [ownerBookings, setOwnerBookings] = React.useState<Booking[]>([]);

  // For prototype purposes, we'll assume the logged-in owner is 'Tunde Ojo' (USR002)
  const currentOwnerId = 'USR002';

  React.useEffect(() => {
    // 1. Find pitches belonging to the current owner
    const ownerPitchNames = placeholderPitches
        .filter(p => p.ownerId === currentOwnerId)
        .map(p => p.name);

    // 2. Filter bookings to only include those for the owner's pitches
    const filteredBookings = placeholderBookings
        .filter(b => ownerPitchNames.includes(b.pitchName));
    
    setOwnerBookings(filteredBookings);
  }, []);


  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">All Bookings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Customer Bookings</CardTitle>
                <CardDescription>A list of all bookings made for your pitches.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead className="hidden sm:table-cell">Pitch</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ownerBookings.length > 0 ? (
                            ownerBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">{booking.id}</div>
                                        <div className="text-xs text-muted-foreground">{booking.customerName}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{booking.pitchName}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{booking.date} at {booking.time}</TableCell>
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
                                                <Link href={`/owner/dashboard/receipt/${booking.id}`}>
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
                                    <p className="text-muted-foreground">When customers book your pitches, you'll see the details here.</p>
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
