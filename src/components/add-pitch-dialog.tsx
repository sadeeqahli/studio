

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
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const operatingHoursSchema = z.object({
  day: z.enum(daysOfWeek),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:MM format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:MM format"),
  enabled: z.boolean(),
});

const pitchSchema = z.object({
  name: z.string().min(3, 'Pitch name is required'),
  location: z.string().min(3, 'Location is required'),
  price: z.coerce.number().min(1000, 'Price must be at least ₦1000'),
  amenities: z.array(z.string()).optional().default([]),
  operatingHours: z.array(operatingHoursSchema).min(1, "Please configure operating hours for at least one day."),
  slotInterval: z.coerce.number().min(30, "Interval must be at least 30 minutes"),
  image: z.any().optional(),
  pitch: z.any().optional(),
}).refine(data => {
    return data.pitch ? true : data.image?.length > 0;
}, {
    message: 'Image is required.',
    path: ['image'],
}).refine(data => {
    const enabledDays = data.operatingHours.filter(h => h.enabled);
    if (enabledDays.length === 0) return false;
    for (const day of enabledDays) {
        if (day.startTime >= day.endTime) return false;
    }
    return true;
}, {
    message: "For enabled days, start time must be before end time.",
    path: ['operatingHours'],
});

type PitchForm = z.infer<typeof pitchSchema> & { pitch: Pitch | null };

interface AddPitchDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddPitch: (pitchData: Omit<Pitch, 'id' | 'status' | 'ownerId'>) => void;
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
      operatingHours: daysOfWeek.map(day => ({ day, startTime: "09:00", endTime: "21:00", enabled: true })),
      slotInterval: 60,
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
        const pitchOperatingHours = pitch.operatingHours;
        const formHours = daysOfWeek.map(day => {
            const existing = pitchOperatingHours.find(h => h.day === day);
            if (existing) {
                return { ...existing, enabled: true };
            }
            return { day, startTime: "09:00", endTime: "21:00", enabled: false };
        });

        reset({
          name: pitch.name,
          location: pitch.location,
          price: pitch.price,
          amenities: pitch.amenities,
          operatingHours: formHours,
          slotInterval: pitch.slotInterval,
          image: undefined,
          pitch: pitch,
        });
        setImagePreview(pitch.imageUrl);
      } else {
        reset({
          name: '',
          location: '',
          price: 0,
          amenities: [],
          operatingHours: daysOfWeek.map(day => ({ day, startTime: "09:00", endTime: "21:00", enabled: true })),
          slotInterval: 60,
          image: undefined,
          pitch: null,
        });
        setImagePreview(null);
      }
    }
  }, [pitch, reset, isOpen]);

  const onSubmit = (data: PitchForm) => {
    setIsLoading(true);
    setTimeout(() => {
      const pitchData = {
          name: data.name,
          location: data.location,
          price: data.price,
          amenities: data.amenities,
          imageUrl: imagePreview || "https://placehold.co/600x400.png",
          imageHint: data.name,
          operatingHours: data.operatingHours.filter(h => h.enabled),
          slotInterval: data.slotInterval,
          manuallyBlockedSlots: pitch?.manuallyBlockedSlots || {},
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{pitch ? 'Edit Pitch Details' : 'Add a New Pitch'}</DialogTitle>
          <DialogDescription>
            {pitch ? 'Update the details for your pitch.' : 'Fill in the details to list your pitch. You can manage its availability separately.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-[70vh] pr-6">
            <form id="pitch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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

                 <Separator />

                <div className="grid gap-4">
                    <Label>Operating Hours & Slots</Label>
                    <div className="grid gap-2">
                        <Label htmlFor="slotInterval" className="text-xs font-normal">Slot Generation Interval (in minutes)</Label>
                        <Select
                            onValueChange={(value) => control._formValues.slotInterval = parseInt(value)}
                            defaultValue={String(watch('slotInterval'))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                                <SelectItem value="120">120 minutes (2 hours)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.slotInterval && <p className="text-sm text-destructive">{errors.slotInterval.message}</p>}
                    </div>

                    <div className="space-y-2 rounded-md border p-4">
                        {daysOfWeek.map((day, index) => (
                             <Controller
                                key={day}
                                name={`operatingHours.${index}`}
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2">
                                        <Checkbox 
                                            checked={field.value.enabled}
                                            onCheckedChange={(checked) => field.onChange({...field.value, enabled: checked})}
                                        />
                                        <Label className={cn(!field.value.enabled && "text-muted-foreground")}>{day}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                             <Input 
                                                type="time" 
                                                value={field.value.startTime}
                                                onChange={(e) => field.onChange({...field.value, startTime: e.target.value})}
                                                disabled={!field.value.enabled}
                                            />
                                             <Input 
                                                type="time" 
                                                value={field.value.endTime}
                                                onChange={(e) => field.onChange({...field.value, endTime: e.target.value})}
                                                disabled={!field.value.enabled}
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                     {errors.operatingHours && <p className="text-sm text-destructive">{errors.operatingHours.message}</p>}
                </div>

                <Separator />

                <div className="grid gap-2">
                    <Label>Amenities</Label>
                    <Controller
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 rounded-md border">
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
                            <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm">{amenity}</Label>
                            </div>
                        ))}
                        </div>
                    )}
                    />
                </div>
            </form>
        </ScrollArea>
        </div>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="pitch-form" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (pitch ? 'Save Changes' : 'Add Pitch')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
