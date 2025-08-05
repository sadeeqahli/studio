
"use client"

import * as React from "react"
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
import { placeholderBookings } from "@/lib/placeholder-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredBookings = placeholderBookings.filter(booking => 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pitchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">Booking Management</h1>
             <Input 
                placeholder="Search by Booking ID or Pitch..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>A list of all bookings made across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Pitch</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.id}</div>
                                </TableCell>
                                <TableCell>{booking.pitchName}</TableCell>
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
                                            <Link href={`/admin/dashboard/receipt/${booking.id}`}>
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
