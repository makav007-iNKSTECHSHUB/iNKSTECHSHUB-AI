import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Circle path for top text wrapping */}
        <path
          id="textCirclePath"
          d="M 250, 250 m -210, 0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0"
        />
      </defs>

      {/* Central Background */}
      <circle cx="250" cy="250" r="245" fill="#FFFFFF" />

      {/* --- CENTRAL EMBLEM PERSPECTIVE TUNNEL GEOMETRY --- */}
      <g id="center-emblem">
        {/* Outer Quadrant Shapes - NORTH (Top) */}
        {/* Top Left Orange Notch */}
        <path d="M 190 90 L 235 90 L 235 160 L 210 160 L 210 120 L 190 120 Z" fill="#FF3B00" />
        <path d="M 190 120 L 240 120 L 240 210 L 210 210 L 210 160 L 190 160 Z" fill="#FF3B00" />

        {/* Top Right Green Notch */}
        <path d="M 310 90 L 265 90 L 265 160 L 290 160 L 290 120 L 310 120 Z" fill="#84CC16" />
        <path d="M 310 120 L 260 120 L 260 210 L 290 210 L 290 160 L 310 160 Z" fill="#84CC16" />

        {/* Outer Quadrant Shapes - SOUTH (Bottom) */}
        {/* Bottom Left Blue Notch */}
        <path d="M 190 410 L 235 410 L 235 340 L 210 340 L 210 380 L 190 380 Z" fill="#0284C7" />
        <path d="M 190 380 L 240 380 L 240 290 L 210 290 L 210 340 L 190 340 Z" fill="#0284C7" />

        {/* Bottom Right Yellow Notch */}
        <path d="M 310 410 L 265 410 L 265 340 L 290 340 L 290 380 L 310 380 Z" fill="#EAB308" />
        <path d="M 310 380 L 260 380 L 260 290 L 290 290 L 290 340 L 310 340 Z" fill="#EAB308" />

        {/* Outer Quadrant Shapes - WEST (Left) */}
        {/* Left Top Orange */}
        <path d="M 90 190 L 90 235 L 160 235 L 160 210 L 120 210 L 120 190 Z" fill="#FF3B00" />
        <path d="M 120 190 L 120 240 L 210 240 L 210 210 L 160 210 L 160 190 Z" fill="#FF3B00" />

        {/* Left Bottom Blue */}
        <path d="M 90 310 L 90 265 L 160 265 L 160 290 L 120 290 L 120 310 Z" fill="#0284C7" />
        <path d="M 120 310 L 120 260 L 210 260 L 210 290 L 160 290 L 160 310 Z" fill="#0284C7" />

        {/* Outer Quadrant Shapes - EAST (Right) */}
        {/* Right Top Green */}
        <path d="M 410 190 L 410 235 L 340 235 L 340 210 L 380 210 L 380 190 Z" fill="#84CC16" />
        <path d="M 380 190 L 380 240 L 290 240 L 290 210 L 340 210 L 340 190 Z" fill="#84CC16" />

        {/* Right Bottom Yellow */}
        <path d="M 410 310 L 410 265 L 340 265 L 340 290 L 380 290 L 380 310 Z" fill="#EAB308" />
        <path d="M 380 310 L 380 260 L 290 260 L 290 290 L 340 290 L 340 310 Z" fill="#EAB308" />

        {/* Black Central Crosshair Axes & Perspective Bars */}
        <rect x="238" y="90" width="24" height="320" fill="#000000" />
        <rect x="90" y="238" width="320" height="24" fill="#000000" />

        {/* Nested Perspective Tunnels (Concentric Rectangles with Step Bands) */}
        {/* Tier 1 (210 to 290) */}
        <rect x="215" y="215" width="70" height="70" fill="none" stroke="#000000" strokeWidth="6" />
        <path d="M 215 215 L 238 238 M 285 215 L 262 238 M 215 285 L 238 262 M 285 285 L 262 262" stroke="#000000" strokeWidth="4" />

        {/* Tier 2 (230 to 270) */}
        <rect x="230" y="230" width="40" height="40" fill="#000000" />
        <rect x="236" y="236" width="28" height="28" fill="#FFFFFF" />
        <rect x="242" y="242" width="16" height="16" fill="#000000" />
        <rect x="246" y="246" width="8" height="8" fill="#FFFFFF" />
      </g>

      {/* --- CIRCULAR TEXT RING --- */}
      {/* MAHMOOD • AI • iNKSTECHSHUB • STUDIO • ART • */}
      <text fontSize="28" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">
        <textPath href="#textCirclePath" startOffset="0%">
          <tspan fill="#FF3B00">MAHMOOD </tspan>
          <tspan fill="#FF3B00">• </tspan>
          <tspan fill="#000000">A</tspan>
          <tspan fill="#FF3B00">I </tspan>
          <tspan fill="#84CC16">• </tspan>
          <tspan fill="#84CC16">iNKSTECHSHUB </tspan>
          <tspan fill="#EAB308">• </tspan>
          <tspan fill="#EAB308">STUDIO </tspan>
          <tspan fill="#0284C7">• </tspan>
          <tspan fill="#0284C7">ART </tspan>
          <tspan fill="#FF3B00">•</tspan>
        </textPath>
      </text>
    </svg>
  );
};
