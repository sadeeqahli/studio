
"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { getPitchById, updatePitch } from "@/lib/placeholder-data"
import type { Pitch } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ArrowLeft, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ManageAvailabilityPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [pitch, setPitch] = React.useState<Pitch | null>(null)
    const [slots, setSlots] = React.useState<Set<string>>(new Set())
    const [newSlot, setNewSlot] = React.useState("")

    React.useEffect(() => {
        const pitchId = params.pitchId as string
        if (pitchId) {
            const foundPitch = getPitchById(pitchId)
            if (foundPitch) {
                setPitch(foundPitch)
                setSlots(new Set(foundPitch.availableSlots))
            } else {
                toast({
                    title: "Pitch not found",
                    variant: "destructive"
                })
                router.push("/owner/dashboard/pitches")
            }
        }
    }, [params.pitchId, router, toast])

    const handleAddSlot = () => {
        const trimmedSlot = newSlot.trim()
        if (trimmedSlot && !slots.has(trimmedSlot)) {
            const newSlots = new Set(slots)
            newSlots.add(trimmedSlot)
            setSlots(newSlots)
            setNewSlot("")
        }
    }

    const handleRemoveSlot = (slotToRemove: string) => {
        const newSlots = new Set(slots)
        newSlots.delete(slotToRemove)
        setSlots(newSlots)
    }

    const handleSaveChanges = () => {
        if (pitch) {
            const updatedPitch = { ...pitch, availableSlots: Array.from(slots) }
            updatePitch(updatedPitch)
            setPitch(updatedPitch)
            toast({
                title: "Success",
                description: "Availability has been updated successfully."
            })
            router.push("/owner/dashboard/pitches")
        }
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
                    <CardTitle>Manage Availability</CardTitle>
                    <CardDescription>Add or remove available time slots for "{pitch.name}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="new-slot">New Time Slot</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="new-slot"
                                    value={newSlot}
                                    onChange={(e) => setNewSlot(e.target.value)}
                                    placeholder="e.g., 6:00 PM - 7:00 PM"
                                />
                                <Button onClick={handleAddSlot}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Current Slots:</h3>
                            {slots.size > 0 ? (
                                <div className="space-y-2">
                                    {Array.from(slots).map((slot) => (
                                        <div key={slot} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                            <span>{slot}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSlot(slot)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No available slots added yet.</p>
                            )}
                        </div>

                        <Button onClick={handleSaveChanges} className="w-full">
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

