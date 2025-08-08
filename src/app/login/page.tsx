
"use client";

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// This file now acts as a redirect to resolve the route conflict.
// It redirects any traffic from /login to the canonical /login page handled by (auth)/login.
export default function RedirectToLogin() {
    useEffect(() => {
        redirect('/login');
    }, []);
    
    return null;
}
