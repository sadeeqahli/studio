import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="40"
    height="40"
    {...props}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="hsl(var(--background))" stroke="url(#grad1)" strokeWidth="4" />
    <g transform="translate(50, 50) scale(0.8)">
      <path
        fill="url(#grad1)"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
      />
      <path
        fill="hsl(var(--background))"
        stroke="url(#grad1)"
        strokeWidth="1.5"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
        transform="rotate(60)"
      />
       <path
        fill="hsl(var(--background))"
        stroke="url(#grad1)"
        strokeWidth="1.5"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
        transform="rotate(120)"
      />
      <path
        fill="url(#grad1)"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
        transform="rotate(180)"
      />
      <path
        fill="hsl(var(--background))"
        stroke="url(#grad1)"
        strokeWidth="1.5"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
        transform="rotate(240)"
      />
       <path
        fill="hsl(var(--background))"
        stroke="url(#grad1)"
        strokeWidth="1.5"
        d="M0 -22.5l12.99 7.5v15L0 7.5l-12.99-7.5v-15z"
        transform="rotate(300)"
      />
    </g>
  </svg>
);

export const NigerianFlag = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="16" viewBox="0 0 3 2" {...props}>
        <rect width="3" height="2" fill="#fff"/>
        <rect width="1" height="2" fill="#008751"/>
        <rect x="2" width="1" height="2" fill="#008751"/>
    </svg>
);
