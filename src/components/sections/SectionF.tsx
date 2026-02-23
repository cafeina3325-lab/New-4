"use client";

import { useRef, useState } from "react";
import { useReviews } from "@/context/ReviewContext";

export default function SectionF() {
    const { reviews } = useReviews();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도 조절
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const formatName = (name: string, hide: boolean) => {
        if (!hide) return name;
        return name.charAt(0) + "**";
    };

    return (
        <section className="py-24 bg-transparent relative overflow-hidden backdrop-blur-sm">
            <div className="container mx-auto px-6 mb-16 text-center">
                <span className="text-[#A89B8C] tracking-widest uppercase text-sm font-medium mb-3 block">Reviews</span>
                <h2 className="text-5xl md:text-6xl xl:text-[5.625rem] font-bold text-[#D6C7B5] mb-6 uppercase tracking-tighter italic break-keep">Client Feedbacks</h2>
            </div>

            <div className="container mx-auto px-6 pb-12 overflow-visible">
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`
                        flex overflow-x-auto gap-10 snap-x snap-mandatory scrollbar-hide pt-16 pb-16 -mt-8
                        ${isDragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab'}
                    `}
                >
                    {reviews.map((item, index) => (
                        <div
                            key={item.id}
                            className={`
                                snap-center shrink-0 w-[280px] md:w-[320px]
                                bg-[#FDFDFD] p-4 pb-12 rounded-sm shadow-2xl
                                transition-all duration-500 hover:-translate-y-8 hover:scale-110 hover:z-50
                                ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                                hover:rotate-0
                            `}
                        >
                            {/* Polaroid Photo Area */}
                            <div className="aspect-[4/5] bg-neutral-900 mb-6 overflow-hidden relative shadow-inner border-[1px] border-black/5">
                                <img
                                    src={item.image}
                                    alt="Tattoo Work"
                                    className="w-full h-full object-cover grayscale-[0.3] contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-0.5 mb-3 px-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < item.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 fill-gray-300'}`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Caption Area */}
                            <p className="text-gray-800 text-sm md:text-base font-medium italic mb-6 leading-relaxed tracking-tight px-1 font-serif min-h-[4.5rem] break-keep">
                                &quot;{item.text}&quot;
                            </p>
                            <div className="flex items-center gap-3 px-1 border-t border-black/5 pt-4">
                                <p className="text-[#A89B8C] text-[10px] font-bold uppercase tracking-widest">— {formatName(item.author, item.hideName)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
