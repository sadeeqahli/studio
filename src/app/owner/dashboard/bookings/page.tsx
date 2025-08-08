

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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Inbox } from "lucide-react"
import type { Booking } from '@/lib/types';
import { getBookingsByOwner } from '@/app/actions';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';


export default async function OwnerBookings() {
    const ownerId = getCookie('loggedInUserId', { cookies });
    let ownerBookings: Booking[] = [];

    if (ownerId) {
        ownerBookings = await getBookingsByOwner(ownerId);
    }
  
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
                            <TableHead>Type</TableHead>
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
                                         <Badge variant={booking.bookingType === 'Online' ? 'default' : 'secondary'} 
                                            className={cn(
                                                'text-xs',
                                                booking.bookingType === 'Online' && 'bg-blue-100 text-blue-800 border-blue-200',
                                                booking.bookingType === 'Offline' && 'bg-purple-100 text-purple-800 border-purple-200',
                                            )}>
                                            {booking.bookingType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₦{booking.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        {booking.status === 'Paid' && (
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/owner/dashboard/receipt/${booking.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
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
