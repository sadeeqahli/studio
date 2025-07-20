import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap } from 'lucide-react';
import type { Pitch } from '@/lib/types';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface PitchCardProps {
  pitch: Pitch;
}

export function PitchCard({ pitch }: PitchCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <Image
          src={pitch.imageUrl}
          alt={pitch.name}
          width={600}
          height={400}
          data-ai-hint={pitch.imageHint}
          className="object-cover w-full aspect-video"
        />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{pitch.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1.5" />
          <span>{pitch.location}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
            {pitch.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary">{amenity}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-secondary/30">
        <div className="text-lg font-bold text-primary">
          ₦{pitch.price.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">/hr</span>
        </div>
        <Button asChild>
          <Link href={`/dashboard/book/${pitch.id}`}>
            <Zap className="w-4 h-4 mr-2" />
            Book Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
