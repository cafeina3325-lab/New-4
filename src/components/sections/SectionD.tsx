"use client";

import Link from "next/link";

/* ── Rounded Hexagon clip-path (objectBoundingBox 0–1) ──
   Pointy-top hexagon vertices: (0.5,0) (1,0.25) (1,0.75) (0.5,1) (0,0.75) (0,0.25)
   Corner radius ≈ 0.04 of bounding box, using Quadratic Bézier at each vertex.
*/
const HEX_CLIP_D = `M 0.464 0.018 Q 0.5 0 0.536 0.018 L 0.964 0.232 Q 1 0.25 1 0.29 L 1 0.71 Q 1 0.75 0.964 0.768 L 0.536 0.982 Q 0.5 1 0.464 0.982 L 0.036 0.768 Q 0 0.75 0 0.71 L 0 0.29 Q 0 0.25 0.036 0.232 Z`;

/* Same path scaled to viewBox 0 0 100 100 for the SVG border stroke */
const HEX_BORDER_D = `M 46.4 1.8 Q 50 0 53.6 1.8 L 96.4 23.2 Q 100 25 100 29 L 100 71 Q 100 75 96.4 76.8 L 53.6 98.2 Q 50 100 46.4 98.2 L 3.6 76.8 Q 0 75 0 71 L 0 29 Q 0 25 3.6 23.2 Z`;

export default function SectionD() {
    const cards = [
        { title: "Precision", desc: "1mm 단위의 섬세한 작업" },
        { title: "Creativity", desc: "다양한 장르의 전문성" },
        { title: "Trust", desc: "1000+ 만족고객" },
    ];

    return (
        <section className="min-h-[80vh] md:min-h-[90vh] xl:min-h-[110vh] flex flex-col justify-center py-24 md:py-32 xl:py-72 bg-transparent w-full overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] md:w-[1100px] xl:w-[1600px] h-[1000px] md:h-[1100px] xl:h-[1600px] bg-orange-950/15 rounded-full blur-[160px] pointer-events-none" />

            {/* ── Shared SVG Defs (clip-path + border path + gradient) ── */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="rounded-hex-clip-d" clipPathUnits="objectBoundingBox">
                        <path d={HEX_CLIP_D} />
                    </clipPath>

                    {/* Metal Base Layer (Champagne Gold / Bronze) */}
                    <linearGradient id="frame-base-d" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5B08A" />
                        <stop offset="25%" stopColor="#8E7345" />
                        <stop offset="50%" stopColor="#4A3B22" />
                        <stop offset="75%" stopColor="#8E7345" />
                        <stop offset="100%" stopColor="#C5B08A" />
                    </linearGradient>

                    {/* Bright Metallic Surface */}
                    <linearGradient id="frame-surface-d" x1="30%" y1="0%" x2="70%" y2="100%">
                        <stop offset="0%" stopColor="#F2E8D5" />
                        <stop offset="50%" stopColor="#D4C4A1" />
                        <stop offset="100%" stopColor="#F2E8D5" />
                    </linearGradient>

                    {/* Sharp Highlight Edge */}
                    <linearGradient id="frame-sharp-d" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Thick Inner Blur Glow */}
                    <linearGradient id="inner-blur-glow-d" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D4C4A1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#A68D5B" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#D4C4A1" stopOpacity="0.8" />
                    </linearGradient>

                    <filter id="ultra-blur-d">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                    </filter>
                </defs>
            </svg>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-16 md:gap-20 xl:gap-44 mb-16 md:relative md:min-h-[60vh] xl:min-h-[100vh]">
                    {/* Text Content — 큰 화면에서 좌측 상단 */}
                    <div className="xl:w-3/5">
                        <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold text-[#D6C7B5] mb-6">Our Philosophy</h2>
                        <h3 className="text-[0.8rem] md:text-xl xl:text-2xl font-semibold text-[#A89B8C] mb-4 break-keep">우리는 피부위에 예술을 새깁니다.</h3>
                        <p className="text-[0.6rem] md:text-base xl:text-xl text-gray-400 leading-relaxed mb-6 whitespace-pre-line break-keep max-w-2xl">
                            각 작품은 단순한 그림이 아닌, 당신의 이야기를 담은 영원한 캔버스입니다.<br />
                            정밀함과 창의성의 균형, 그리고 고객과의 깊은 소통을 통해 세상에 단 하나뿐인 작품을 만듭니다.
                        </p>
                        <Link href="/about">
                            <button className="px-3 py-1.5 md:px-6 md:py-3 xl:px-8 xl:py-4 text-[0.5rem] md:text-base xl:text-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition backdrop-blur-sm">
                                Detail
                            </button>
                        </Link>
                    </div>

                    {/* Cards Grid - Triangle Layout — 큰 화면에서 우측 하단 */}
                    <div className="flex flex-col items-center w-full mt-8 md:mt-0 xl:absolute xl:bottom-0 xl:right-0 xl:w-auto">
                        {/* Top Card */}
                        <div className="w-[140px] md:w-[260px] lg:w-[300px] xl:w-[330px] shrink-0">
                            <HexCard title={cards[0].title} desc={cards[0].desc} />
                        </div>

                        {/* Bottom Row */}
                        <div className="flex w-full justify-center gap-[3vw] md:gap-6 -mt-[20px] md:-mt-[55px] lg:-mt-[65px] xl:-mt-[70px]">
                            {cards.slice(1).map((card, i) => (
                                <div key={i} className="w-[140px] md:w-[260px] lg:w-[300px] xl:w-[330px] shrink-0">
                                    <HexCard title={card.title} desc={card.desc} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Hex Card Component ── */
function HexCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:drop-shadow-[0_16px_40px_rgba(0,0,0,0.8)] hover:-translate-y-2 transition-all duration-300">
            {/* Outer shape container with clip-path */}
            <div
                className="relative z-10 w-full overflow-hidden"
                style={{
                    aspectRatio: '1 / 1.1547',
                    clipPath: "url(#rounded-hex-clip-d)",
                    WebkitClipPath: "url(#rounded-hex-clip-d)",
                    containerType: 'inline-size',
                }}
            >
                {/* ── Blur Layer: backdrop-blur on a child element (no clip-path on this one) ── */}
                <div
                    className="absolute inset-0 z-0 backdrop-blur-[40px]"
                    style={{ WebkitBackdropFilter: 'blur(40px)' }}
                />

                {/* ── Frosted Glass Background (Warmed up) ── */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-stone-800/60 via-stone-900/70 to-[#1C1310]/80" />

                {/* ── Complex Beveled Metallic Frame (5 layers) ── */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Base dark groove (widest) */}
                    <path d={HEX_BORDER_D} fill="none" stroke="url(#frame-base-d)" strokeWidth="30" vectorEffect="non-scaling-stroke" />
                    {/* Main surface (inset) */}
                    <path d={HEX_BORDER_D} fill="none" stroke="url(#frame-surface-d)" strokeWidth="15" vectorEffect="non-scaling-stroke" />
                    {/* Outer sharp highlight */}
                    <path d={HEX_BORDER_D} fill="none" stroke="url(#frame-sharp-d)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    {/* Inner sharp highlight (accurate center scaling: tx = 50 * (1-0.8) = 5 - EXPANDED INNER BORDER) */}
                    <path d={HEX_BORDER_D} fill="none" stroke="url(#frame-sharp-d)" strokeWidth="5" vectorEffect="non-scaling-stroke" transform="translate(10, 10) scale(0.8)" />

                    {/* Inner Thick Blur (expanded range, accurate center scaling: tx = 50 * (1-0.85) = 7.5) */}
                    <path d={HEX_BORDER_D} fill="none" stroke="url(#inner-blur-glow-d)" strokeWidth="30" filter="url(#ultra-blur-d)" vectorEffect="non-scaling-stroke" transform="translate(7.5, 7.5) scale(0.85)" />
                </svg>

                {/* ── Frosted Glass Highlights ── */}
                <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/12 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(255,255,255,0.12)_0%,_transparent_70%)] pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />

                {/* ── Content ── */}
                <div className="p-[10%] flex flex-col items-center justify-center h-full relative z-20">
                    <h4 className="font-light tracking-[0.15em] text-amber-200/90 mb-[5cqw] text-[11cqw] leading-tight break-keep drop-shadow-sm">{title}</h4>
                    <p className="text-gray-300/80 font-light word-keep break-keep text-[6.5cqw] leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    );
}
