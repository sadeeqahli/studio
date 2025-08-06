
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { placeholderPitches as allPitches, updatePitch, addPitch as addNewPitch } from "@/lib/placeholder-data"
import { Pitch } from "@/lib/types"
import { AddPitchDialog } from "@/components/add-pitch-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import Link from "next/link"

export default function OwnerPitches() {
  const [pitches, setPitches] = React.useState<Pitch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPitch, setEditingPitch] = React.useState<Pitch | null>(null);
  const { toast } = useToast();

  // For this prototype, we'll hardcode the current owner's ID.
  const currentOwnerId = 'USR002';

  React.useEffect(() => {
    // Filter pitches to only show those owned by the current owner
    setPitches(allPitches.filter(p => p.ownerId === currentOwnerId));
  }, []);


  const handleAddPitch = (newPitchData: Omit<Pitch, 'id' | 'imageHint' | 'status' | 'ownerId'>) => {
    const newPitch: Pitch = {
      ...newPitchData,
      id: `PITCH-${Date.now()}`,
      imageHint: 'football field',
      status: 'Active',
      ownerId: currentOwnerId,
    };
    addNewPitch(newPitch);
    // Refresh the component's state to include the new pitch
    setPitches(prev => [...prev, newPitch]);
    toast({ title: "Success!", description: "New pitch has been added." });
    setIsDialogOpen(false);
  };

  const handleEditPitch = (updatedPitch: Pitch) => {
    updatePitch(updatedPitch);
    setPitches(prev => prev.map(p => p.id === updatedPitch.id ? updatedPitch : p));
    toast({ title: "Success!", description: "Pitch details have been updated." });
    setEditingPitch(null);
    setIsDialogOpen(false);
  };
  
  const openEditDialog = (pitch: Pitch) => {
    setEditingPitch(pitch);
    setIsDialogOpen(true);
  }

  const handleDeactivate = (pitchId: string) => {
    const pitchToDeactivate = pitches.find(p => p.id === pitchId);
    if (pitchToDeactivate) {
       const updatedPitch = { ...pitchToDeactivate, status: 'Unlisted' as const };
       updatePitch(updatedPitch);
       setPitches(prev => prev.map(p => p.id === pitchId ? updatedPitch : p));
       toast({ 
            title: "Pitch Deactivated", 
            description: "The pitch has been unlisted and is no longer visible to players.",
       });
    }
  }

  const handleActivate = (pitchId: string) => {
    const pitchToActivate = pitches.find(p => p.id === pitchId);
    if (pitchToActivate) {
        const updatedPitch = { ...pitchToActivate, status: 'Active' as const };
        updatePitch(updatedPitch);
        setPitches(prev => prev.map(p => p.id === pitchId ? updatedPitch : p));
        toast({
            title: "Pitch Activated",
            description: "The pitch is now active and visible to players.",
        });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">My Pitches</h1>
        <Button size="sm" className="h-8 gap-1" onClick={() => { setEditingPitch(null); setIsDialogOpen(true); }}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Pitch
            </span>
        </Button>
      </div>
      <AddPitchDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddPitch={handleAddPitch}
        onEditPitch={handleEditPitch}
        pitch={editingPitch}
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Listed Pitches</CardTitle>
          <CardDescription>Manage your pitches and their availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pitches.length > 0 ? (
                pitches.map((pitch) => (
                  <TableRow key={pitch.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={pitch.imageUrl}
                        width="64"
                        data-ai-hint={pitch.imageHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{pitch.name}</TableCell>
                    <TableCell>
                      <Badge variant={pitch.status === 'Active' ? 'outline' : 'secondary'} className={pitch.status === 'Active' ? 'text-green-600 border-green-400 bg-green-50' : ''}>{pitch.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono">
                      ₦{pitch.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(pitch)}>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/owner/dashboard/pitches/${pitch.id}/availability`}>Manage Availability</Link>
                          </DropdownMenuItem>
                          {pitch.status === 'Active' ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                  Deactivate
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will deactivate the pitch. It will no longer be visible to players for booking. You can reactivate it later.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeactivate(pitch.id)}>Deactivate</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivate(pitch.id)}>
                                Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No pitches found. Add your first pitch to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
