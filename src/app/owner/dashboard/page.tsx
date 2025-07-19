import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, Calendar, BarChart3 } from "lucide-react"

export default function OwnerDashboard() {
  const stats = [
    { title: "Total Revenue", value: "₦1,250,000", icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "+20.1% from last month" },
    { title: "New Bookings", value: "+52", icon: <Users className="h-4 w-4 text-muted-foreground" />, description: "+15 since last week" },
    { title: "Bookings this Month", value: "128", icon: <Calendar className="h-4 w-4 text-muted-foreground" />, description: "+8.5% from last month" },
    { title: "Active Pitches", value: "4", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />, description: "All pitches are online" },
  ];

  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Dashboard Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {stat.title}
                    </CardTitle>
                    {stat.icon}
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                        {stat.description}
                    </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Recent bookings list will be displayed here.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pitch Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A chart showing pitch occupancy will be here.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
