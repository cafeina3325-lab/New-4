"use client";

import React from "react";
// Checking file structure, I didn't see lib/utils in the file list earlier. I'll stick to standard template strings to be safe.

interface GlassHexagonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    width?: string;
    height?: string;
    doubleBorder?: boolean;
}

export default function GlassHexagon({
    children,
    className,
    width = "w-full",
    height = "h-full",
    doubleBorder = false,
    ...props
}: GlassHexagonProps) {
    return (
        <div
            className={`relative group ${width} ${height} flex items-center justify-center ${className || ""}`}
            {...props}
        >
            {/* 
        Hexagon Clip Path Strategy:
        We need a "stretched" hexagon. 
        Polygon for flat-topped hexagon (pointy sides):
        0% 50% (Left Point)
        25% 0% (Top Left)
        75% 0% (Top Right)
        100% 50% (Right Point)
        75% 100% (Bottom Right)
        25% 100% (Bottom Left)
        
        Wait, "Vertical" hexagon has points at top/bottom. "Horizontal" usually means points at left/right?
        User said "stretched hexagon... height : width = 1 : 1.15~1.25". 
        Usually a regular hexagon width:height is sqrt(3)/2 : 1 (vertical) or 1 : sqrt(3)/2 (horizontal).
        If height:width is 1:1.2, it's wider than tall. 
        Standard flat-topped hexagon (points Left/Right) has Width = 2 * Side, Height = sqrt(3) * Side. Ratio W/H = 2/1.732 ≈ 1.15. 
        So a standard "Pointy Side" hexagon IS naturally ratio ~1.15.
        
        Clip path for Pointy Side (Flat Top/Bottom):
        polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
      */}

            {/* 1. Outer Filter Shadow Container (Not clipped, but holds the shadow) 
          Actually, drop-shadow on a clipped element works best.
      */}
            {/* 1. Outer Filter Shadow Container */}
            {/* 1. Outer Filter Shadow Container */}
            <div
                className="absolute inset-0 transition-all duration-700 group-hover:scale-[1.02]"
                style={{
                    filter: "none"
                }}
            >
                {/* 2. The Main Glass Shape with 'True Radius' Mask */}
                <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                        maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M28,1 L72,1 Q76,1 78,5 L97,44 Q100,50 97,56 L78,95 Q76,99 72,99 L28,99 Q24,99 22,95 L3,56 Q0,50 3,44 L22,5 Q24,1 28,1 Z' fill='black'/%3E%3C/svg%3E")`,
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M28,1 L72,1 Q76,1 78,5 L97,44 Q100,50 97,56 L78,95 Q76,99 72,99 L28,99 Q24,99 22,95 L3,56 Q0,50 3,44 L22,5 Q24,1 28,1 Z' fill='black'/%3E%3C/svg%3E")`,
                        maskSize: '100% 100%',
                        WebkitMaskSize: '100% 100%',
                        background: "rgba(255, 255, 255, 0.08)",
                    }}
                >
                    {/* Backdrop Blur Layer */}
                    <div className="absolute inset-0 bg-white/[0.12] backdrop-blur-[32px] md:backdrop-blur-[42px]" />

                    {/* Noise Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Gloss Overlay */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.1] to-transparent pointer-events-none" />

                    {/* Content Container (Standard Centering restored) */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        {children}
                    </div>
                </div>

                {/* 3. Border Overlay (Matching Smooth Path) */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Metallic Gold Gradient for Outer Border */}
                        <linearGradient id="outer-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#E3CF9C" />
                            <stop offset="50%" stopColor="#B4975A" />
                            <stop offset="100%" stopColor="#856A32" />
                        </linearGradient>

                        {/* Soft Shimmer Gradient for Inner Glass Border */}
                        <linearGradient id="inner-glass-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                        </linearGradient>
                    </defs>
                    {/* Inner Border (Double Border Effect - Glassy Blur) */}
                    {doubleBorder && (
                        <path
                            d="M30,4 L70,4 Q73,4 75,7 L94,44 Q97,50 94,56 L75,93 Q73,96 70,96 L30,96 Q27,96 25,93 L6,56 Q3,50 6,44 L25,7 Q27,4 30,4 Z"
                            vectorEffect="non-scaling-stroke"
                            fill="none"
                            stroke="url(#inner-glass-gradient)"
                            strokeWidth="8"
                            strokeLinejoin="round"
                            filter="url(#glass-blur)"
                        />
                    )}
                    {/* Outer Border (Matte Gold) */}
                    <path
                        d="M28,1 L72,1 Q76,1 78,5 L97,44 Q100,50 97,56 L78,95 Q76,99 72,99 L28,99 Q24,99 22,95 L3,56 Q0,50 3,44 L22,5 Q24,1 28,1 Z"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        stroke="url(#outer-gold-gradient)"
                        strokeWidth="8"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
