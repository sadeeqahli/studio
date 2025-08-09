
"use client";

import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from '@/app/actions';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function ProfileForm({ user }: { user: User }) {
    const { toast } = useToast();
    const router = useRouter();
    
    // Safely split name into first and last
    const nameParts = user.name.split(' ');
    const initialFirstName = nameParts[0] || '';
    const initialLastName = nameParts.slice(1).join(' ') || '';

    const [firstName, setFirstName] = React.useState(initialFirstName);
    const [lastName, setLastName] = React.useState(initialLastName);
    const [email, setEmail] = React.useState(user.email);
    
    const isInfoChanged = firstName !== initialFirstName || lastName !== initialLastName || email !== user.email;

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedUser: User = {
            ...user,
            name: `${firstName} ${lastName}`.trim(), // Rejoin and trim to handle single names
            email: email,
        };
        
        await updateUser(updatedUser);
        router.refresh();

        toast({
        title: "Success!",
        description: "Your personal information has been updated.",
        });
    };

    return (
        <Card>
            <form onSubmit={handleSaveChanges}>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name..."/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name..."/>
                        </div>
                    </div>
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address..." />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={!isInfoChanged}>Save Changes</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
