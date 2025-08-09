
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
import { getOwnerPitches } from "@/app/actions"
import { Pitch } from "@/lib/types"
import { AddEditPitchButton } from "@/components/owner/add-edit-pitch-button"
import { TogglePitchStatus } from "@/components/owner/toggle-pitch-status"
import Image from "next/image"
import Link from "next/link"
import { getCookie } from "cookies-next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export default async function OwnerPitches() {
  const ownerId = getCookie('loggedInUserId', { cookies });
  if (!ownerId) {
    notFound();
  }
  
  const pitches = await getOwnerPitches(ownerId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">My Pitches</h1>
        <AddEditPitchButton ownerId={ownerId} />
      </div>
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
                pitches.map((pitch: Pitch) => (
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
                          <DropdownMenuItem asChild>
                            <AddEditPitchButton ownerId={ownerId} pitchToEdit={pitch}>Edit Details</AddEditPitchButton>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/owner/dashboard/pitches/${pitch.id}/availability`}>Manage Availability</Link>
                          </DropdownMenuItem>
                          <TogglePitchStatus pitch={pitch} />
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
