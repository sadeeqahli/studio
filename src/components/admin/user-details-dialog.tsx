
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Mail, List, BarChart3, Clock, CheckCircle } from 'lucide-react';
import type { User as UserType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserDetailsDialogProps {
  user: UserType | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UserDetailsDialog({ user, isOpen, setIsOpen }: UserDetailsDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
             <Avatar>
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              {user.name}
              <Badge variant="outline" className="ml-2">{user.role}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed information and activity for this user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
             <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Registered On</p>
                    <p className="text-sm text-muted-foreground">{user.registeredDate}</p>
                </div>
            </div>
            <div className="grid grid-cols-[24px_1fr] items-start pb-4 last:pb-0">
                <CheckCircle className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="grid gap-1">
                    <p className="font-medium leading-none">Status</p>
                     <Badge
                        variant={user.status === 'Active' ? 'default' : 'destructive'}
                        className={cn('w-fit', user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
                    >
                        {user.status}
                    </Badge>
                </div>
            </div>

            {user.role === 'Owner' && (
                <div className="grid grid-cols-[24px_1fr] items-start">
                    <List className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="grid gap-1">
                        <p className="font-medium leading-none">Pitches Listed</p>
                        <p className="text-sm text-muted-foreground">{user.pitchesListed ?? 0}</p>
                    </div>
                </div>
            )}
             {user.role === 'Player' && (
                <div className="grid grid-cols-[24px_1fr] items-start">
                    <BarChart3 className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="grid gap-1">
                        <p className="font-medium leading-none">Total Bookings</p>
                        <p className="text-sm text-muted-foreground">{user.totalBookings ?? 0}</p>
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
