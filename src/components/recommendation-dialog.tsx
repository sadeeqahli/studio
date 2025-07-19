'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPitchRecommendation } from '@/app/actions';
import type { PitchRecommendationOutput } from '@/ai/flows/pitch-recommendation';
import { Star, Loader2, AlertCircle, MapPin, CheckCircle, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const recommendationSchema = z.object({
  location: z.string().min(3, 'Location is required'),
  time: z.string().min(1, 'Time is required'),
  budget: z.coerce.number().min(1000, 'Budget must be at least ₦1000'),
  amenities: z.string().optional(),
});

type RecommendationForm = z.infer<typeof recommendationSchema>;

export function RecommendationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PitchRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecommendationForm>({
    resolver: zodResolver(recommendationSchema),
  });

  const onSubmit = async (data: RecommendationForm) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    const result = await getPitchRecommendation({
      ...data,
      amenities: data.amenities || 'Any',
    });
    setIsLoading(false);
    if (result.data) {
      setRecommendation(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
      setRecommendation(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Star className="mr-2 h-4 w-4" /> Get AI Recommendation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Pitch Finder</DialogTitle>
          <DialogDescription>
            Tell us what you're looking for, and we'll find the perfect pitch for you.
          </DialogDescription>
        </DialogHeader>
        {!recommendation && (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Input id="location" placeholder="e.g., Surulere, Lagos" {...register('location')} />
              {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time Slot</Label>
              <Input id="time" placeholder="e.g., Saturday 5pm" {...register('time')} />
              {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (in Naira)</Label>
              <Input id="budget" type="number" placeholder="e.g., 20000" {...register('budget')} />
              {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amenities">Preferred Amenities</Label>
              <Input id="amenities" placeholder="e.g., Floodlights, good parking" {...register('amenities')} />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding...</> : 'Get Recommendation'}
                </Button>
            </DialogFooter>
            </form>
        )}
        
        {recommendation && (
            <div className="py-4">
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary"/> Our Top Pick for You!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <h3 className="text-xl font-bold text-primary">{recommendation.pitchName}</h3>
                        <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-1 shrink-0"/> {recommendation.address}</p>
                        <p className="font-semibold text-lg">Price: ₦{recommendation.price.toLocaleString()}</p>
                        <p><span className="font-semibold">Amenities:</span> {recommendation.amenities}</p>
                        <p className="flex items-center"><Smartphone className="h-4 w-4 mr-2"/> <span className="font-semibold">Contact:</span> {recommendation.contact}</p>
                        
                        <Button className="w-full mt-4" onClick={() => window.open(recommendation.mapUrl, '_blank')}>
                            <MapPin className="mr-2 h-4 w-4"/> View on Map
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}

        {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
