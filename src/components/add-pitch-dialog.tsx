
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
import { Loader2, X, PlusCircle } from 'lucide-react';
import { Pitch } from '@/lib/types';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const pitchSchema = z.object({
  name: z.string().min(3, 'Pitch name is required'),
  location: z.string().min(3, 'Location is required'),
  price: z.coerce.number().min(1000, 'Price must be at least ₦1000'),
  amenities: z.array(z.string()).optional().default([]),
  image: z.any().optional(),
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
  onAddPitch: (pitchData: Omit<Pitch, 'id' | 'imageHint' | 'status' | 'ownerId'>) => void;
  onEditPitch: (pitch: Pitch) => void;
  pitch: Pitch | null;
}

const allAmenities = ['Floodlights', 'Changing Rooms', 'Parking', 'Bibs', 'Water', 'Lounge', 'Cafe', 'Secure'];
const standardSlots = [
    "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"
];


export function AddPitchDialog({ isOpen, setIsOpen, onAddPitch, onEditPitch, pitch }: AddPitchDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<{ [date: string]: string[] }>({});
  const [newSlot, setNewSlot] = useState("");
  
  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const slotsForDate = availableSlots[dateKey] || [];

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
          image: undefined,
          pitch: pitch,
        });
        setImagePreview(pitch.imageUrl);
        setAvailableSlots(pitch.availableSlots || {});
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
        setAvailableSlots({});
      }
      setSelectedDate(new Date());
    }
  }, [pitch, reset, isOpen]);
  
  const handleAddSlot = () => {
        const trimmedSlot = newSlot.trim()
        if (trimmedSlot && !slotsForDate.includes(trimmedSlot)) {
            const updatedSlots = [...slotsForDate, trimmedSlot].sort();
            setAvailableSlots(prev => ({ ...prev, [dateKey]: updatedSlots }));
            setNewSlot("")
        } else {
             toast({
                title: "Invalid Slot",
                description: "Time slot cannot be empty or a duplicate.",
                variant: "destructive"
            })
        }
    }

    const handleRemoveSlot = (slotToRemove: string) => {
        const updatedSlots = slotsForDate.filter(slot => slot !== slotToRemove);
        setAvailableSlots(prev => ({ ...prev, [dateKey]: updatedSlots }));
    }
    
    const addAllSlots = () => {
        setAvailableSlots(prev => ({ ...prev, [dateKey]: standardSlots }));
    }

    const clearAllSlots = () => {
        setAvailableSlots(prev => ({ ...prev, [dateKey]: [] }));
    }


  const onSubmit = (data: PitchForm) => {
    setIsLoading(true);
    setTimeout(() => {
      const pitchData = {
          name: data.name,
          location: data.location,
          price: data.price,
          amenities: data.amenities,
          imageUrl: imagePreview || "https://placehold.co/600x400.png",
          availableSlots: availableSlots,
          allDaySlots: standardSlots,
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
      <DialogContent className="max-w-4xl grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle>{pitch ? 'Edit Pitch' : 'Add a New Pitch'}</DialogTitle>
          <DialogDescription>
            {pitch ? 'Update the details and availability for your pitch.' : 'Fill in the details and initial availability to list your pitch.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-8 py-4">
                {/* Left side: Pitch Details */}
                <ScrollArea className="h-96 w-full pr-6">
                    <div className="space-y-4">
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
                    </div>
                </ScrollArea>
                 {/* Right side: Availability */}
                <div className="space-y-4">
                    <h3 className="font-semibold">Set Initial Availability</h3>
                    <div className="flex justify-center">
                         <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </div>
                     <Separator />
                    <div>
                         <Label>
                            Available slots for <span className="font-semibold text-primary">{selectedDate ? format(selectedDate, "PPP") : "..."}</span>
                        </Label>
                         <div className="flex gap-2 mt-1">
                                <Input
                                    value={newSlot}
                                    onChange={(e) => setNewSlot(e.target.value)}
                                    placeholder="e.g., 6:00 PM - 7:00 PM"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSlot();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={handleAddSlot}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium">Current Slots:</h3>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm" type="button" onClick={addAllSlots}>All</Button>
                                     <Button variant="outline" size="sm" type="button" onClick={clearAllSlots}>None</Button>
                                </div>
                            </div>
                            {slotsForDate.length > 0 ? (
                                <ScrollArea className="h-32 pr-2 border rounded-md p-2">
                                    {slotsForDate.map((slot) => (
                                        <div key={slot} className="flex items-center justify-between p-2 bg-muted rounded-md mb-2">
                                            <span>{slot}</span>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSlot(slot)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </ScrollArea>
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                                    No available slots for this day.
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (pitch ? 'Save Changes' : 'Add Pitch')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    