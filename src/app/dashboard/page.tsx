
"use client";

import * as React from 'react';
import { PitchCard } from '@/components/pitch-card';
import { placeholderPitches } from '@/lib/placeholder-data';
import { RecommendationDialog } from '@/components/recommendation-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { Pitch } from '@/lib/types';

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredPitches, setFilteredPitches] = React.useState<Pitch[]>(placeholderPitches);

  React.useEffect(() => {
    const results = placeholderPitches.filter(pitch =>
      pitch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPitches(results);
  }, [searchTerm]);

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
            <RecommendationDialog />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="lg:col-span-2 xl:col-span-2">
            <CardHeader>
                <CardTitle>Pitch Map</CardTitle>
                <CardDescription>Find pitches visually near you.</CardDescription>
            </CardHeader>
            <CardContent className='h-[300px] flex items-center justify-center bg-muted rounded-b-lg'>
                <div className="text-center text-muted-foreground">
                    <MapPin className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Map integration coming soon.</p>
                    <p className="text-xs">Requires Google Maps API Key setup.</p>
                </div>
            </CardContent>
        </Card>
        {filteredPitches.slice(0, 2).map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPitches.slice(2).map((pitch) => (
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
