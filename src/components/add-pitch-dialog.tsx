
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
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

const pitchSchema = z.object({
  name: z.string().min(3, 'Pitch name is required'),
  location: z.string().min(3, 'Location is required'),
  price: z.coerce.number().min(1000, 'Price must be at least ₦1000'),
  amenities: z.array(z.string()).optional().default([]),
  image: z.any().optional(), // Make image optional for editing
}).refine(data => {
    // In edit mode (pitch is not null), image is optional.
    // In add mode (pitch is null), image is required.
    return data.pitch ? true : data.image?.length > 0;
}, {
    message: 'Image is required.',
    path: ['image'],
});


type PitchForm = z.infer<typeof pitchSchema> & { pitch: Pitch | null };

interface AddPitchDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddPitch: (pitchData: Omit<Pitch, 'id' | 'imageHint' | 'availableSlots' | 'status' | 'ownerId'>) => void;
  onEditPitch: (pitch: Pitch) => void;
  pitch: Pitch | null;
}

const allAmenities = ['Floodlights', 'Changing Rooms', 'Parking', 'Bibs', 'Water', 'Lounge', 'Cafe', 'Secure'];

export function AddPitchDialog({ isOpen, setIsOpen, onAddPitch, onEditPitch, pitch }: AddPitchDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<PitchForm>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      name: '',
      location: '',
      price: 0,
      amenities: [],
      image: undefined,
      pitch: null,
    }
  });

  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!pitch) {
      setImagePreview(null);
    }
  }, [imageFile, pitch]);


  useEffect(() => {
    if (isOpen) {
      if (pitch) {
        reset({
          name: pitch.name,
          location: pitch.location,
          price: pitch.price,
          amenities: pitch.amenities,
          image: undefined, // cannot pre-fill file input
          pitch: pitch,
        });
        setImagePreview(pitch.imageUrl);
      } else {
        reset({
          name: '',
          location: '',
          price: 0,
          amenities: [],
          image: undefined,
          pitch: null,
        });
        setImagePreview(null);
      }
    }
  }, [pitch, reset, isOpen]);

  const onSubmit = (data: PitchForm) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const pitchData = {
          name: data.name,
          location: data.location,
          price: data.price,
          amenities: data.amenities,
          imageUrl: imagePreview || "https://placehold.co/600x400.png"
      };

      if (pitch) {
        onEditPitch({ ...pitch, ...pitchData });
      } else {
        onAddPitch(pitchData);
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
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) handleClose();
        else setIsOpen(true);
    }}>
      <DialogContent className="sm:max-w-md grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle>{pitch ? 'Edit Pitch' : 'Add a New Pitch'}</DialogTitle>
          <DialogDescription>
            {pitch ? 'Update the details for your pitch.' : 'Fill in the details to list your pitch on the platform.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 w-full pr-6">
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
                <Label htmlFor="image">Pitch Image</Label>
                <Input id="image" type="file" accept="image/*" {...register('image')} />
                {errors.image && <p className="text-sm text-destructive">{errors.image.message as string}</p>}
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Image Preview" className="rounded-md object-cover aspect-video" />
                    </div>
                )}
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
            </form>
        </ScrollArea>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (pitch ? 'Save Changes' : 'Add Pitch')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
