
import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 60"
        width="100"
        height="30"
        {...props}
    >
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
            </linearGradient>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght=700&display=swap');`}
            </style>
        </defs>
        
        <circle cx="30" cy="30" r="25" fill="none" stroke="url(#logo-gradient)" strokeWidth="5" />
        <circle cx="30" cy="30" r="18" fill="none" stroke="url(#logo-gradient)" strokeWidth="3" opacity="0.7" />

        <text 
            x="65" 
            y="42" 
            fontFamily="Montserrat, sans-serif"
            fontSize="36" 
            fontWeight="bold" 
            fill="url(#logo-gradient)"
            textAnchor="start"
        >
            LinkHub
        </text>
    </svg>
);


export const NigerianFlag = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="16" viewBox="0 0 3 2" {...props}>
        <rect width="3" height="2" fill="#fff"/>
        <rect width="1" height="2" fill="#008751"/>
        <rect x="2" width="1" height="2" fill="#008751"/>
    </svg>
);
