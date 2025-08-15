"use client";

import * as React from 'react';
import { PitchCard } from '@/components/pitch-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Activity, Gift } from 'lucide-react';
import { Pitch } from '@/lib/types';
import { getPitches } from '../actions';
import { useSearchParams } from 'next/navigation';
import { User } from '@/lib/types'; // Assuming User type is defined elsewhere and imported

// Placeholder for user data and other fetched data
// In a real application, this would come from an API or state management
const getUserData = async (): Promise<User | null> => {
  // Replace with actual data fetching logic
  return {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bookings: [
      { id: 'b1', pitchId: 'p1', userId: 'user1', amount: 5000, date: new Date() },
      { id: 'b2', pitchId: 'p2', userId: 'user1', amount: 7000, date: new Date() },
      { id: 'b3', pitchId: 'p3', userId: 'user1', amount: 6000, date: new Date() },
    ],
    rewardBalance: 15000, // Example reward balance
    referralCode: 'REF123',
    invitedUsers: 5, // Example count
    activeInvitedUsers: 3, // Example count
    hasMadeBooking: true, // Example flag
  };
};

const getThisMonthBookings = async (): Promise<Array<{ amount: number }>> => {
  // Replace with actual data fetching logic for this month's bookings
  // For demonstration, returning a subset of user bookings
  const user = await getUserData();
  if (!user) return [];
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthBookings = user.bookings.filter(booking => new Date(booking.date) >= startOfMonth);
  return thisMonthBookings.map(b => ({ amount: b.amount }));
};


export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allPitches, setAllPitches] = React.useState<Pitch[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const [thisMonthBookings, setThisMonthBookings] = React.useState<{ amount: number }[]>([]);
  const searchParams = useSearchParams(); // To trigger re-render on navigation

  React.useEffect(() => {
    const fetchData = async () => {
      const pitches = await getPitches();
      setAllPitches(pitches.filter(p => p.status === 'Active'));
      const userData = await getUserData();
      setUser(userData);
      const bookings = await getThisMonthBookings();
      setThisMonthBookings(bookings);
    };
    fetchData();
  }, [searchParams]);

  const filteredPitches = allPitches.filter(pitch =>
    pitch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pitch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg font-semibold md:text-2xl">Available Pitches</h1>
        <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name or location..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Displaying current month bookings and reward balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{thisMonthBookings.reduce((acc, b) => acc + b.amount, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {thisMonthBookings.length} bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reward Balance
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(user?.rewardBalance || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available for discount
            </p>
          </CardContent>
        </Card>
        {/* End of reward widgets */}

        {filteredPitches.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
      {filteredPitches.length === 0 && (
        <Card className="col-span-full">
            <CardContent className="p-10 text-center text-muted-foreground">
                <Search className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Pitches Found</h3>
                <p>Try adjusting your search term.</p>
            </CardContent>
        </Card>
      )}
    </>
  );
}