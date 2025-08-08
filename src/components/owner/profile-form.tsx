"use client";

import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from '@/app/actions';
import type { User } from '@/lib/types';

export function ProfileForm({ user }: { user: User }) {
    const { toast } = useToast();
    const [fullName, setFullName] = React.useState(user.name);
    const [email, setEmail] = React.useState(user.email);

    const isInfoChanged = fullName !== user.name || email !== user.email;

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedUser: User = {
            ...user,
            name: fullName,
            email: email,
        };

        await updateUser(updatedUser);
        
        toast({
            title: "Success!",
            description: "Your profile information has been updated.",
        });
    };

    return (
        <Card>
            <form onSubmit={handleSaveChanges}>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>Update your personal and business details here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="owner-name">Full Name</Label>
                        <Input id="owner-name" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={!isInfoChanged}>Save Changes</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
