
"use client"

import * as React from "react"
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
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { placeholderPitches } from "@/lib/placeholder-data"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Pitch } from "@/lib/types"

export default function AdminPitchesPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [pitches, setPitches] = React.useState<Pitch[]>([]);

    React.useEffect(() => {
        // Initialize state from placeholder data only on component mount
        setPitches(placeholderPitches);
    }, []);


    const filteredPitches = pitches.filter(pitch => 
        pitch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pitch.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTogglePitchStatus = (pitchId: string) => {
        setPitches(currentPitches =>
            currentPitches.map(pitch => {
                if (pitch.id === pitchId) {
                    const newStatus = pitch.status === 'Active' ? 'Unlisted' : 'Active';
                    toast({
                        title: `Pitch ${newStatus}`,
                        description: `The pitch "${pitch.name}" has been ${newStatus.toLowerCase()}.`,
                    });
                    return { ...pitch, status: newStatus };
                }
                return pitch;
            })
        );
    };

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">Pitch Management</h1>
             <Input 
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Pitches</CardTitle>
                <CardDescription>A list of all pitches listed on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredPitches.map((pitch) => (
                    <TableRow key={pitch.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt="Pitch image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={pitch.imageUrl}
                            width="64"
                            data-ai-hint={pitch.imageHint}
                        />
                    </TableCell>
                    <TableCell className="font-medium">
                        {pitch.name}
                        <div className="text-sm text-muted-foreground">{pitch.location}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">Tunde Ojo</TableCell>
                     <TableCell>
                         <Badge
                            variant={pitch.status === 'Active' ? 'outline' : 'destructive'}
                            className={cn(pitch.status === 'Active' ? 'text-green-600 border-green-400 bg-green-50' : 'text-red-600 border-red-400 bg-red-50')}
                        >
                            {pitch.status}
                        </Badge>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleTogglePitchStatus(pitch.id)}>
                                {pitch.status === 'Active' ? 'Unlist Pitch' : 'Re-list Pitch'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}
