import Link from "next/link";

/* ── Rounded Flat-Top Hexagon (more rounded, r≈0.06) ──
   Vertices: (0,0.5) (0.25,0) (0.75,0) (1,0.5) (0.75,1) (0.25,1)
   Quadratic Bézier at each vertex for smooth rounding.
*/
const HEX_CLIP_E = `M 0.027 0.446 Q 0 0.5 0.027 0.554 L 0.223 0.946 Q 0.25 1 0.31 1 L 0.69 1 Q 0.75 1 0.777 0.946 L 0.973 0.554 Q 1 0.5 0.973 0.446 L 0.777 0.054 Q 0.75 0 0.69 0 L 0.31 0 Q 0.25 0 0.223 0.054 Z`;

const HEX_BORDER_E = `M 2.7 44.6 Q 0 50 2.7 55.4 L 22.3 94.6 Q 25 100 31 100 L 69 100 Q 75 100 77.7 94.6 L 97.3 55.4 Q 100 50 97.3 44.6 L 77.7 5.4 Q 75 0 69 0 L 31 0 Q 25 0 22.3 5.4 Z`;

export default function SectionE() {
    const genres = [
        { id: 1, title: "Irezumi", query: "Irezumi", image: "/Section E/irezumi.png" },
        { id: 2, title: "Old School", query: "Old School", image: "/Section E/oldschool.png" },
        { id: 3, title: "Tribal", query: "Tribal", image: "/Section E/tribal.png" },
        { id: 4, title: "Black & Grey", query: "Black & Grey", image: "/Section E/black-and-gray.png" },
        { id: 5, title: "Blackwork", query: "Blackwork", image: "/Section E/blackwork.png" },
        { id: 6, title: "Oriental Art", query: "Oriental Art", image: "/Section E/oriental art.png" },
        { id: 7, title: "Watercolor", query: "Watercolor", image: "/Section E/watercolor.png" },
        { id: 8, title: "Illustration", query: "Illustration", image: "/Section E/illustration.png" },
        { id: 9, title: "Mandala", query: "Mandala", image: "/Section E/mandala.png" },
        { id: 10, title: "Sak Yant", query: "Sak Yant", image: "/Section E/sak-yant.png" },
        { id: 11, title: "Lettering", query: "Lettering", image: "/Section E/lettering.png" },
        { id: 12, title: "ETC.", query: "Specialties", image: "/Section E/etc.png" },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-transparent w-full relative overflow-hidden">
            {/* ── Shared SVG Defs (clip-path + border path + 3D gold gradients) ── */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="rounded-hex-clip-e" clipPathUnits="objectBoundingBox">
                        <path d={HEX_CLIP_E} />
                    </clipPath>

                    {/* Metal Base Layer (Champagne Gold / Bronze tones) */}
                    <linearGradient id="frame-base-e" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5B08A" />
                        <stop offset="25%" stopColor="#8E7345" />
                        <stop offset="50%" stopColor="#4A3B22" />
                        <stop offset="75%" stopColor="#8E7345" />
                        <stop offset="100%" stopColor="#C5B08A" />
                    </linearGradient>

                    {/* Bright Metallic Surface */}
                    <linearGradient id="frame-surface-e" x1="30%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" stopColor="#F2E8D5" />
                        <stop offset="50%" stopColor="#D4C4A1" />
                        <stop offset="100%" stopColor="#F2E8D5" />
                    </linearGradient>

                    {/* Sharp Highlight Edge */}
                    <linearGradient id="frame-sharp-e" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Thick Inner Blur Glow */}
                    <linearGradient id="inner-blur-glow-e" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4C4A1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#A68D5B" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#D4C4A1" stopOpacity="0.8" />
                    </linearGradient>

                    <filter id="ultra-blur-e">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                    </filter>
                </defs>
            </svg>

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-5xl md:text-6xl xl:text-[5.625rem] font-bold text-center mb-20 text-[#D6C7B5]">Genres</h2>

                {/* Grid Layout with Vertical Stagger */}
                <div className={`
                    grid grid-cols-3 lg:grid-cols-4 
                    gap-x-4 gap-y-10 lg:gap-y-14 
                    max-w-4xl mx-auto place-items-center pb-20
                    
                    [&>*:nth-child(3n+2)]:translate-y-1/2
                    lg:[&>*:nth-child(3n+2)]:translate-y-0
                    lg:[&>*:nth-child(even)]:!translate-y-1/2
                `}>
                    {genres.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genres?genre=${encodeURIComponent(genre.query)}`}
                            className="group block focus:outline-none filter drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_16px_50px_rgba(180,140,30,0.3)] hover:-translate-y-2 transition-all duration-300 relative z-0 hover:z-50"
                            style={{ width: '120%' }}
                        >
                            <div
                                className="w-full aspect-[1.1547] relative items-center justify-center flex overflow-hidden border-0 group-hover:scale-105 transition-transform duration-500"
                                style={{
                                    clipPath: "url(#rounded-hex-clip-e)",
                                    WebkitClipPath: "url(#rounded-hex-clip-e)"
                                }}
                            >
                                {/* ── Genre Background Image ── */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${genre.image}')` }}
                                />
                                {/* ── Dark Overlay for Readability (slightly darker on hover for better text contrast) ── */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/45 transition-colors duration-300 z-[1]" />

                                {/* ── Complex Beveled Metallic Frame (Multi-staged) ── */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Base dark groove (widest) */}
                                    <path d={HEX_BORDER_E} fill="none" stroke="url(#frame-base-e)" strokeWidth="20" vectorEffect="non-scaling-stroke" />
                                    {/* Main surface (inset) */}
                                    <path d={HEX_BORDER_E} fill="none" stroke="url(#frame-surface-e)" strokeWidth="10" vectorEffect="non-scaling-stroke" />
                                    {/* Outer sharp highlight */}
                                    <path d={HEX_BORDER_E} fill="none" stroke="url(#frame-sharp-e)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    {/* Inner sharp highlight (accurate center scaling: tx = 50 * (1-0.88) = 6) */}
                                    <path d={HEX_BORDER_E} fill="none" stroke="url(#frame-sharp-e)" strokeWidth="2" vectorEffect="non-scaling-stroke" transform="translate(6, 6) scale(0.88)" />

                                    {/* Inner Thick Blur (expanded range, accurate center scaling: tx = 50 * (1-0.9) = 5) */}
                                    <path d={HEX_BORDER_E} fill="none" stroke="url(#inner-blur-glow-e)" strokeWidth="20" filter="url(#ultra-blur-e)" vectorEffect="non-scaling-stroke" transform="translate(5, 5) scale(0.9)" />
                                </svg>

                                {/* ── Dark Glass Interior Lighting ── */}
                                <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/12 to-transparent pointer-events-none z-10" />
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(255,255,255,0.1)_0%,_transparent_65%)] pointer-events-none z-10" />
                                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-10" />

                                <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                                    <span
                                        className="text-[0.6rem] md:text-lg font-bold tracking-[0.14em] text-white 
                                        drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
                                        group-hover:text-amber-200 group-hover:scale-110 
                                        group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]
                                        text-center transition-all duration-500 break-keep leading-tight uppercase transform-gpu"
                                    >
                                        {genre.title}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
