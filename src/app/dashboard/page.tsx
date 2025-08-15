
"use client";

import * as React from 'react';
import { PitchCard } from '@/components/pitch-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Activity, Gift } from 'lucide-react';
import { Pitch, User } from '@/lib/types';
import { getPitches, getUserById, getBookingsByUser } from '../actions';
import { useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allPitches, setAllPitches] = React.useState<Pitch[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const [thisMonthBookings, setThisMonthBookings] = React.useState<{ amount: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged in user ID from cookie
        const userId = getCookie('loggedInUserId');
        
        if (userId) {
          const [pitches, userData] = await Promise.all([
            getPitches(),
            getUserById(userId.toString())
          ]);
          
          setAllPitches(pitches.filter(p => p.status === 'Active'));
          
          if (userData) {
            setUser(userData);
            
            // Get user's actual bookings
            const userBookings = await getBookingsByUser(userData.name);
            
            // Filter for this month's bookings
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const thisMonthUserBookings = userBookings.filter(booking => 
              new Date(booking.date) >= startOfMonth && booking.status === 'Paid'
            );
            
            setThisMonthBookings(thisMonthUserBookings.map(b => ({ amount: b.amount })));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [searchParams]);

  const filteredPitches = allPitches.filter(pitch =>
    pitch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pitch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        {/* This Month Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {thisMonthBookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </CardContent>
        </Card>
        
        {/* Reward Balance */}
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

        {filteredPitches.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
      {filteredPitches.length === 0 && !loading && (
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
