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

const ownerBookings = [
    { id: 'BK1', customer: 'Ade Williams', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK2', customer: 'Chioma Nwosu', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '5:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK3', customer: 'Femi Adebayo', pitch: 'Ikeja 5-a-side', date: '2024-07-29', time: '6:00 PM', amount: 18000, status: 'Pending'},
    { id: 'BK4', customer: 'Aisha Bello', pitch: 'Asokoro Green', date: '2024-07-30', time: '3:00 PM', amount: 22000, status: 'Paid'},
    { id: 'BK5', customer: 'Emeka Okafor', pitch: 'Lekki AstroTurf', date: '2024-08-01', time: '7:00 PM', amount: 25000, status: 'Cancelled'},
]

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
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Pitch</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ownerBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.customer}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{booking.pitch}</TableCell>
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
