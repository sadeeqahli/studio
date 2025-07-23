
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
            <CardContent className='h-[300px] p-0 rounded-b-lg overflow-hidden'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46348281735!2d3.115933394531248!3d6.548981600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0x5df9fe84a20a50b3!2sLagos!5e0!3m2!1sen!2sng!4v1700000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map of Pitches in Lagos"
                ></iframe>
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
