
"use client";

import * as React from 'react';
import { PitchCard } from '@/components/pitch-card';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Pitch } from '@/lib/types';
import { getPitches } from '../actions';

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allPitches, setAllPitches] = React.useState<Pitch[]>([]);
  const [filteredPitches, setFilteredPitches] = React.useState<Pitch[]>([]);

  React.useEffect(() => {
    const fetchPitches = async () => {
      const pitches = await getPitches();
      setAllPitches(pitches);
      setFilteredPitches(pitches);
    };
    fetchPitches();
  }, []);

  React.useEffect(() => {
    const results = allPitches.filter(pitch =>
      pitch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPitches(results);
  }, [searchTerm, allPitches]);

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
