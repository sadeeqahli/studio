import { PitchCard } from '@/components/pitch-card';
import { placeholderPitches } from '@/lib/placeholder-data';
import { RecommendationDialog } from '@/components/recommendation-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function UserDashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Available Pitches</h1>
        <RecommendationDialog />
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
        {placeholderPitches.slice(0, 2).map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {placeholderPitches.slice(2).map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
    </>
  );
}
