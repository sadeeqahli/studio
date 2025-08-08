"use client";

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Switch between light and dark mode.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{theme === 'light' ? 'Current theme: Light' : 'Current theme: Dark'}.</span>
                    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </CardContent>
        </Card>
    );
}
