
"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Pitch } from '@/lib/types';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

const pitchSchema = z.object({
  name: z.string().min(3, 'Pitch name is required'),
  location: z.string().min(3, 'Location is required'),
  price: z.coerce.number().min(1000, 'Price must be at least ₦1000'),
  amenities: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url('Please enter a valid image URL').min(1, 'Image URL is required'),
});

type PitchForm = z.infer<typeof pitchSchema>;

interface AddPitchDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddPitch: (pitchData: Omit<Pitch, 'id' | 'imageHint' | 'availableSlots'>) => void;
  onEditPitch: (pitch: Pitch) => void;
  pitch: Pitch | null;
}

const allAmenities = ['Floodlights', 'Changing Rooms', 'Parking', 'Bibs', 'Water', 'Lounge', 'Cafe', 'Secure'];

export function AddPitchDialog({ isOpen, setIsOpen, onAddPitch, onEditPitch, pitch }: AddPitchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PitchForm>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      name: '',
      location: '',
      price: 0,
      amenities: [],
      imageUrl: '',
    }
  });

  useEffect(() => {
    if (pitch) {
      reset({
        name: pitch.name,
        location: pitch.location,
        price: pitch.price,
        amenities: pitch.amenities,
        imageUrl: pitch.imageUrl,
      });
    } else {
      reset({
        name: '',
        location: '',
        price: 0,
        amenities: [],
        imageUrl: '',
      });
    }
  }, [pitch, reset, isOpen]);

  const onSubmit = (data: PitchForm) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (pitch) {
        onEditPitch({ ...pitch, ...data });
      } else {
        onAddPitch(data);
      }
      setIsLoading(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{pitch ? 'Edit Pitch' : 'Add a New Pitch'}</DialogTitle>
          <DialogDescription>
            {pitch ? 'Update the details for your pitch.' : 'Fill in the details to list your pitch on the platform.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Pitch Name</Label>
            <Input id="name" placeholder="e.g., Lekki Goals Arena" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Lekki Phase 1, Lagos" {...register('location')} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price per Hour (NGN)</Label>
            <Input id="price" type="number" placeholder="e.g., 25000" {...register('price')} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" placeholder="e.g., https://example.com/pitch.jpg" {...register('imageUrl')} />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Amenities</Label>
            <Controller
              name="amenities"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 p-2 rounded-md border">
                  {allAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={field.value?.includes(amenity)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), amenity]
                            : (field.value || []).filter((a) => a !== amenity);
                          field.onChange(newValue);
                        }}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (pitch ? 'Save Changes' : 'Add Pitch')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
