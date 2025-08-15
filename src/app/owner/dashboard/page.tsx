
import * as React from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getUserById, getOwnerPitches, getBookingsByOwner } from '@/app/actions';
import { OwnerDashboardClient } from '@/components/owner/owner-dashboard-client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// This is now an async Server Component, its only job is to fetch data.
export default async function OwnerDashboard() {
  const cookieStore = await cookies();
  const ownerIdCookie = cookieStore.get('loggedInUserId');
  const ownerId = ownerIdCookie?.value;
  if (!ownerId) {
    // This can happen if the cookie expires.
    // Show an error card instead of just calling notFound().
    return (
      <div className="flex items-center justify-center h-full">
          <Card className="max-w-md w-full text-center">
              <CardHeader>
                  <CardTitle>Authentication Error</CardTitle>
                  <CardDescription>Could not verify your session. Please try logging in again.</CardDescription>
              </CardHeader>
          </Card>
      </div>
    )
  }
  
  const ownerData = await getUserById(ownerId);
  if (!ownerData) {
     return (
        <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>Error Loading Data</CardTitle>
                    <CardDescription>Could not load owner data. Please try logging in again.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
  }

  // Fetch all necessary data here on the server
  const [pitchesData, bookingsData] = await Promise.all([
    getOwnerPitches(ownerId),
    getBookingsByOwner(ownerId)
  ]);
  
  // Pass the fetched data as props to the Client Component
  return (
    <OwnerDashboardClient 
      owner={ownerData}
      ownerPitches={pitchesData}
      ownerBookings={bookingsData}
    />
  );
}
