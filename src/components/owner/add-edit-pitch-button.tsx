
"use client";

import * as React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddPitchDialog } from "@/components/add-pitch-dialog";
import { Pitch } from "@/lib/types";
import { addPitch, updatePitch } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AddEditPitchButtonProps extends React.PropsWithChildren<ButtonProps> {
    ownerId: string;
    pitchToEdit?: Pitch | null;
}

export function AddEditPitchButton({ ownerId, pitchToEdit = null, children, ...props }: AddEditPitchButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSave = async (pitchData: Omit<Pitch, 'id' | 'status' | 'ownerId'>) => {
        if (pitchToEdit) {
            // Editing existing pitch
            const updatedPitch = { ...pitchToEdit, ...pitchData };
            await updatePitch(updatedPitch);
            toast({ title: "Success!", description: "Pitch details have been updated." });
        } else {
            // Adding new pitch
            const newPitch: Pitch = {
                ...pitchData,
                id: `PITCH-${Date.now()}`,
                status: 'Active',
                ownerId: ownerId,
            };
            await addPitch(newPitch);
            toast({ title: "Success!", description: "New pitch has been added." });
        }
        
        setIsDialogOpen(false);
        router.refresh(); // Re-fetches data on the current route
    };
    
    if (pitchToEdit) {
        return (
            <>
                <div onClick={() => setIsDialogOpen(true)} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    {children}
                </div>
                 <AddPitchDialog 
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    onSave={handleSave}
                    pitch={pitchToEdit}
                />
            </>
        )
    }

    return (
        <>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)} {...props}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Pitch
                </span>
            </Button>
            <AddPitchDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSave={handleSave}
                pitch={null}
            />
        </>
    );
}
