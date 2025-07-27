
"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { placeholderBookings } from "@/lib/placeholder-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function BookingHistory() {
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
                        {placeholderBookings.map((booking) => (
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
