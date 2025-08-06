
"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { placeholderPitches, updatePitch } from "@/lib/placeholder-data"
import type { Pitch } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ArrowLeft, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function ManageAvailabilityPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [pitch, setPitch] = React.useState<Pitch | null>(null)
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
    const [slotsForDate, setSlotsForDate] = React.useState<Set<string>>(new Set())
    const [newSlot, setNewSlot] = React.useState("")
    const pitchId = params.pitchId as string;

    React.useEffect(() => {
        if (pitchId) {
            const foundPitch = placeholderPitches.find(p => p.id === pitchId);
            if (foundPitch) {
                setPitch(foundPitch)
            } else {
                toast({
                    title: "Pitch not found",
                    variant: "destructive"
                })
                router.push("/owner/dashboard/pitches")
            }
        }
    }, [pitchId, router, toast])

    React.useEffect(() => {
        if (pitch && selectedDate) {
            const dateKey = format(selectedDate, 'yyyy-MM-dd')
            // Use allDaySlots as the base and filter out booked slots for that day if needed
            // For now, we just manage the availableSlots object
            const existingSlots = pitch.availableSlots[dateKey] || pitch.allDaySlots || []
            setSlotsForDate(new Set(existingSlots))
        }
    }, [pitch, selectedDate])

    const handleAddSlot = () => {
        const trimmedSlot = newSlot.trim()
        if (trimmedSlot && !slotsForDate.has(trimmedSlot)) {
            const newSlots = new Set(slotsForDate)
            newSlots.add(trimmedSlot)
            setSlotsForDate(newSlots)
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
        const newSlots = new Set(slotsForDate)
        newSlots.delete(slotToRemove)
        setSlotsForDate(newSlots)
    }

    const handleSaveChanges = () => {
        if (pitch && selectedDate) {
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            const updatedSlots = { ...pitch.availableSlots, [dateKey]: Array.from(slotsForDate) };
            const updatedPitchData = { ...pitch, availableSlots: updatedSlots };
            
            updatePitch(updatedPitchData);
            setPitch(updatedPitchData);
            
            toast({
                title: "Success",
                description: `Availability for ${format(selectedDate, 'PPP')} has been updated.`
            });
        }
    }
    
    const addAllSlots = () => {
        if (pitch) {
            setSlotsForDate(new Set(pitch.allDaySlots));
        }
    }

    const clearAllSlots = () => {
        setSlotsForDate(new Set());
    }


    if (!pitch) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/owner/dashboard/pitches">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pitches
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Availability for "{pitch.name}"</CardTitle>
                    <CardDescription>Select a date to add or remove available time slots.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                             <Label>
                                Availability for <span className="font-semibold text-primary">{selectedDate ? format(selectedDate, "PPP") : "..."}</span>
                            </Label>
                        </div>
                        <div>
                            <Label htmlFor="new-slot">New Time Slot (e.g., 6PM-7PM)</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="new-slot"
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
                                <Button onClick={handleAddSlot}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium">Current Slots:</h3>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm" onClick={addAllSlots}>All</Button>
                                     <Button variant="outline" size="sm" onClick={clearAllSlots}>None</Button>
                                </div>
                            </div>
                            {slotsForDate.size > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border rounded-md p-2">
                                    {Array.from(slotsForDate).sort().map((slot) => (
                                        <div key={slot} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                            <span>{slot}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSlot(slot)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                                    No available slots for this day.
                                </p>
                            )}
                        </div>

                        <Button onClick={handleSaveChanges} className="w-full">
                            Save Changes for this Date
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
