
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, List, CheckCircle, Image as ImageIcon, Clock } from 'lucide-react';
import type { Pitch } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from "next/image";
import { Separator } from '../ui/separator';

interface PitchDetailsDialogProps {
  pitch: Pitch | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function PitchDetailsDialog({ pitch, isOpen, setIsOpen }: PitchDetailsDialogProps) {
  if (!pitch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
              {pitch.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information for this pitch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
                 <Image
                    src={pitch.imageUrl}
                    alt={pitch.name}
                    fill
                    className="object-cover"
                    data-ai-hint={pitch.imageHint}
                />
            </div>
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Location</p>
                    <p className="text-sm text-muted-foreground">{pitch.location}</p>
                </div>
            </div>
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Price</p>
                    <p className="text-sm text-muted-foreground font-mono">₦{pitch.price.toLocaleString()} / hour</p>
                </div>
            </div>
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <CheckCircle className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Status</p>
                     <Badge
                        variant={pitch.status === 'Active' ? 'outline' : 'destructive'}
                        className={cn('w-fit', pitch.status === 'Active' ? 'text-green-600 border-green-400 bg-green-50' : 'text-red-600 border-red-400 bg-red-50')}
                    >
                        {pitch.status}
                    </Badge>
                </div>
            </div>

            <Separator />
            
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <List className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Amenities</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {pitch.amenities.map(amenity => (
                            <Badge key={amenity} variant="secondary">{amenity}</Badge>
                        ))}
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-[24px_1fr] items-start">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Operating Hours</p>
                    <div className="space-y-1 mt-1">
                        {pitch.operatingHours.map(hour => (
                            <div key={hour.day} className="flex justify-between text-sm text-muted-foreground">
                                <span>{hour.day}</span>
                                <span className="font-mono">{hour.startTime} - {hour.endTime}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
