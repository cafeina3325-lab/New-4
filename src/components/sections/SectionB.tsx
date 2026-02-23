"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function SectionB() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to get random items for a set of genres
    const getImagesForGenres = (genreList: string[]) => {
        const filtered = PORTFOLIO_DATA.filter(item => genreList.includes(item.genre));
        // Shuffle and duplicate to ensure enough items for the marquee
        return [...filtered, ...filtered].sort(() => Math.random() - 0.5);
    };

    // Row definitions based on requirements
    const rowsMobile = useMemo(() => [
        { genres: ["Illustration", "ETC."], speed: "80s", dir: "left" as const },
        { genres: ["Irezumi", "Old School"], speed: "150s", dir: "right" as const },
        { genres: ["Black & Grey", "Blackwork", "Tribal"], speed: "110s", dir: "left" as const },
        { genres: ["Oriental Art", "Watercolor"], speed: "70s", dir: "right" as const },
        { genres: ["Mandala", "Sak Yant", "Lettering"], speed: "90s", dir: "left" as const },
    ], []);

    const rowsTablet = useMemo(() => [
        { genres: ["Irezumi", "Old School", "Sak Yant", "ETC."], speed: "220s", dir: "left" as const },
        { genres: ["Black & Grey", "Blackwork", "Tribal", "Lettering"], speed: "180s", dir: "right" as const },
        { genres: ["Oriental Art", "Watercolor", "Illustration", "Mandala"], speed: "120s", dir: "left" as const },
    ], []);

    const rowsDesktop = useMemo(() => [
        { genres: ["Oriental Art", "Watercolor", "Illustration"], speed: "120s", dir: "left" as const },
        { genres: ["Black & Grey", "Blackwork", "Mandala"], speed: "180s", dir: "right" as const },
        { genres: ["Irezumi", "Old School", "Tribal"], speed: "220s", dir: "left" as const },
        { genres: ["Sak Yant", "Lettering", "ETC."], speed: "150s", dir: "right" as const },
    ], []);

    if (!mounted) return <section id="section-b" className="bg-transparent h-screen w-full" />;

    return (
        <section id="section-b" className="bg-transparent h-screen w-full flex flex-col overflow-hidden pointer-events-none select-none">
            {/* Mobile/sm View (5 rows) */}
            <div className="flex md:hidden flex-col h-full gap-0.5 py-0.5">
                {rowsMobile.map((row, idx) => (
                    <div key={`m-${idx}`} className="flex-1 min-h-0 py-0.5">
                        <MarqueeRow images={getImagesForGenres(row.genres)} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>

            {/* md/lg View (3 rows) */}
            <div className="hidden md:flex xl:hidden flex-col h-full gap-1 py-1">
                {rowsTablet.map((row, idx) => (
                    <div key={`t-${idx}`} className="flex-1 min-h-0 py-1">
                        <MarqueeRow images={getImagesForGenres(row.genres)} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>

            {/* xl/2xl+ View (4 rows) */}
            <div className="hidden xl:flex flex-col h-full gap-1.5 py-1.5">
                {rowsDesktop.map((row, idx) => (
                    <div key={`d-${idx}`} className="flex-1 min-h-0 py-1">
                        <MarqueeRow images={getImagesForGenres(row.genres)} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function MarqueeRow({ images, speed, direction }: { images: any[], speed: string, direction: 'left' | 'right' }) {
    // We duplicate the set of images again to ensure seamless looping
    const displayImages = [...images, ...images];

    return (
        <div className="relative flex whitespace-nowrap overflow-hidden h-full">
            <div
                className={`flex h-full gap-2 md:gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
                style={{ animationDuration: speed }}
            >
                {displayImages.map((item, i) => (
                    <div
                        key={`${item.id}-${i}`}
                        className="h-full aspect-[4/5] shrink-0 relative rounded-lg overflow-hidden border border-white/10 shadow-2xl grayscale-[0.3]"
                    >
                        <Image
                            src={item.image}
                            alt={item.genre}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vh, 35vh"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}
