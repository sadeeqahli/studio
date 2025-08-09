
"use client";

import * as React from 'react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { updatePitch } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Pitch } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface TogglePitchStatusProps {
    pitch: Pitch;
}

export function TogglePitchStatus({ pitch }: TogglePitchStatusProps) {
    const { toast } = useToast();
    const router = useRouter();

    const handleToggle = async () => {
        const newStatus = pitch.status === 'Active' ? 'Unlisted' : 'Active';
        const updatedPitch = { ...pitch, status: newStatus };
        
        await updatePitch(updatedPitch);
        
        toast({
            title: `Pitch ${newStatus}`,
            description: `The pitch "${updatedPitch.name}" has been ${newStatus.toLowerCase()}.`,
        });
        
        router.refresh();
    };
    
    if (pitch.status === 'Active') {
        return (
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
                    <AlertDialogAction onClick={handleToggle}>Deactivate</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
    
    return (
        <DropdownMenuItem onClick={handleToggle}>
            Activate
        </DropdownMenuItem>
    );
}

