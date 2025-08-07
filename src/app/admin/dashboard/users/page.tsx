
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { placeholderCredentials } from "@/lib/placeholder-data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { UserDetailsDialog } from "@/components/admin/user-details-dialog"
import type { User } from "@/lib/types"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { ActivityLogCard } from "@/components/admin/activity-log-card"
import { placeholderActivities } from "@/lib/placeholder-data"

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = React.useState<User[]>(placeholderCredentials);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    const handleToggleUserStatus = (userId: string) => {
        let updatedUser: User | undefined;
        const newUsers = users.map(user => {
            if (user.id === userId) {
                const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                updatedUser = { ...user, status: newStatus };
                return updatedUser;
            }
            return user;
        });

        setUsers(newUsers);

        if (updatedUser) {
             toast({
                title: `User ${updatedUser.status}`,
                description: `${updatedUser.name}'s account has been ${updatedUser.status.toLowerCase()}.`,
            });
        }
    };

    const handleDeleteUser = (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        if (userToDelete) {
            setUsers(users.filter(user => user.id !== userId));
            toast({
                title: "User Deleted",
                description: `${userToDelete.name} has been permanently deleted.`,
                variant: "destructive",
            });
        }
    };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
                <Input 
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all registered users on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="hidden md:table-cell">Registered</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{user.registeredDate}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'Active' ? 'default' : 'destructive'}
                                            className={cn(user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>View Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>{user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                    className="text-destructive"
                                                    onSelect={(e) => e.preventDefault()}
                                                    >
                                                    Delete User
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the
                                                        account for <span className="font-semibold">{user.name}</span> and remove their data from our servers.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className={cn(buttonVariants({ variant: "destructive" }))}
                                                    >
                                                        Yes, delete user
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
        <div className="lg:col-span-1">
             <ActivityLogCard activities={placeholderActivities.filter(a => a.action === 'Logged In' || a.action === 'Signed Up')} />
        </div>
        {selectedUser && (
            <UserDetailsDialog
                user={selectedUser}
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
            />
        )}
    </div>
  )
}
