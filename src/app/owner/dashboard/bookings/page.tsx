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


export default function OwnerBookings() {
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
                            <TableHead className="hidden md:table-cell">Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.id}</div>
                                    <div className="text-xs text-muted-foreground">Sample Customer</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{booking.pitchName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{booking.date}</TableCell>
                                <TableCell className="hidden md:table-cell">{booking.time}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
