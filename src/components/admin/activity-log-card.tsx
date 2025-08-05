
"use client";

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/lib/types";

interface ActivityLogCardProps {
    activities: Activity[];
}

function TimeAgo({ timestamp }: { timestamp: string }) {
    const [timeAgo, setTimeAgo] = React.useState('');

    React.useEffect(() => {
        // This effect runs only on the client, preventing hydration mismatch
        const date = new Date(timestamp);
        setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    }, [timestamp]);

    return <span className="text-xs text-muted-foreground">{timeAgo || '...'}</span>;
}


export function ActivityLogCard({ activities }: ActivityLogCardProps) {
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name.substring(0, 2);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>A log of recent user signups and logins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map(activity => (
                    <div key={activity.id} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${activity.userName}`} />
                            <AvatarFallback>{getInitials(activity.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5 text-sm">
                            <p>
                                <span className="font-semibold text-foreground">{activity.userName}</span>
                                {' '}
                                {activity.action.toLowerCase()}
                            </p>
                             <div className="flex items-center gap-2">
                                <Badge variant="secondary">{activity.userRole}</Badge>
                                <TimeAgo timestamp={activity.timestamp} />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
