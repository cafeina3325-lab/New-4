"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ContactOverlay from "@/components/layout/ContactOverlay";

// Data Definitions
const genres = [
    "Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork",
    "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."
];

const parts = [
    "Head", "Face", "Neck", "Shoulder", "Chest",
    "Belly", "Back", "Arm", "Leg", "Hand", "Foot"
];

function GalleryContent() {
    const searchParams = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState<"Portfolio" | "Event">("Portfolio");
    const [portfolioFilterType, setPortfolioFilterType] = useState<"Genre" | "Parts">("Genre");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // null means "All"
    const [selectedParts, setSelectedParts] = useState<string[]>([]);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [showButtons, setShowButtons] = useState(false);

    // Scroll Handler for floating buttons
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButtons(true);
            } else {
                setShowButtons(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Initialize state from URL query params
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        const filterParam = searchParams.get("filter");
        const itemParam = searchParams.get("item");

        if (tabParam === "Event") {
            setActiveTab("Event");
        } else {
            setActiveTab("Portfolio");
        }

        if (filterParam === "Parts") {
            setPortfolioFilterType("Parts");
            if (itemParam && itemParam !== "All") {
                setSelectedParts([itemParam]);
            }
        } else {
            setPortfolioFilterType("Genre");
            if (itemParam) {
                // Map Specialties to ETC. if coming from Genres page
                const mappedItem = itemParam === "Specialties" ? "ETC." : itemParam;
                if (genres.includes(mappedItem)) {
                    setSelectedGenre(mappedItem);
                } else if (mappedItem === "All") {
                    setSelectedGenre(null);
                }
            }
        }
    }, [searchParams]);

    const filterItems = portfolioFilterType === "Genre" ? genres : parts;

    // Helper to determine if an item is selected
    const isSelected = (item: string) => {
        if (portfolioFilterType === "Genre") {
            return item === selectedGenre;
        } else {
            return selectedParts.includes(item);
        }
    };

    // Helper to handle filter clicks
    const handleFilterClick = (item: string) => {
        if (portfolioFilterType === "Genre") {
            // Toggle Logic for Genre
            if (selectedGenre === item) {
                setSelectedGenre(null); // Deselect -> All
            } else {
                setSelectedGenre(item);
            }
        } else {
            // Multi-select logic for Parts
            if (selectedParts.includes(item)) {
                setSelectedParts(selectedParts.filter(p => p !== item));
            } else {
                setSelectedParts([...selectedParts, item]);
            }
        }
    };

    const isAllSelected = portfolioFilterType === "Genre" ? selectedGenre === null : selectedParts.length === 0;

    return (
        <main className="pt-[120px] min-h-screen bg-[#1C1310] text-[#D6C7B5] pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#D6C7B5] break-keep">Gallery</h1>

                {/* Main Tab Navigation */}
                <div className="flex justify-center mb-12 border-b border-white/5">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("Portfolio")}
                            className={`pb-4 text-lg font-medium transition-all relative ${activeTab === "Portfolio"
                                ? "text-[#B69676] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#B69676]"
                                : "text-[#D4B483]/50 hover:text-[#D4B483]"
                                }`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab("Event")}
                            className={`pb-4 text-lg font-medium transition-all relative ${activeTab === "Event"
                                ? "text-[#B69676] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#B69676]"
                                : "text-[#D4B483]/50 hover:text-[#D4B483]"
                                }`}
                        >
                            Event
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {activeTab === "Portfolio" ? (
                        <div className="space-y-12">
                            {/* Portfolio Filter Controls */}
                            <div className="flex flex-col items-center gap-8">
                                {/* Filter Type Toggle */}
                                <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
                                    <button
                                        onClick={() => setPortfolioFilterType("Genre")}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${portfolioFilterType === "Genre"
                                            ? "bg-[#B69676] text-[#1C1310] shadow-md"
                                            : "text-[#D4B483]/60 hover:text-[#D6C7B5]"
                                            }`}
                                    >
                                        By Genre
                                    </button>
                                    <button
                                        onClick={() => setPortfolioFilterType("Parts")}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${portfolioFilterType === "Parts"
                                            ? "bg-[#B69676] text-[#1C1310] shadow-md"
                                            : "text-[#D4B483]/60 hover:text-[#D6C7B5]"
                                            }`}
                                    >
                                        By Parts
                                    </button>
                                </div>

                                {/* Filter Items List */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full max-w-5xl px-4">
                                    {filterItems.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => handleFilterClick(item)}
                                            className={`px-2 py-3 rounded-lg text-sm font-medium transition-all border ${isSelected(item)
                                                ? "bg-[#B69676] text-[#1C1310] border-[#B69676] shadow-md transform scale-[1.02]"
                                                : "glass-panel text-[#D4B483] border-white/5 hover:border-[#B69676]/30 hover:text-[#D6C7B5] hover:shadow-sm"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Portfolio Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Placeholder Items for Portfolio - Filtering logic simulated */}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-lg relative group overflow-hidden cursor-pointer border border-white/5 hover:border-[#B69676]/20 transition-colors">
                                        <div className="absolute inset-0 flex items-center justify-center text-[#D4B483]/40 group-hover:text-[#D4B483]/80 transition-colors flex-col gap-2">
                                            <span className="font-medium">Work {i + 1}</span>
                                            <span className="text-xs text-[#D4B483]/20 group-hover:text-[#D4B483]/40">
                                                {portfolioFilterType === "Genre"
                                                    ? (isAllSelected ? "All Genres" : selectedGenre)
                                                    : (isAllSelected ? "All Parts" : selectedParts.join(", "))
                                                }
                                            </span>
                                        </div>
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-[#1C1310]/60 backdrop-blur-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-end p-6">
                                            <div className="glass-panel p-4 rounded-xl w-full bg-[#1C1310]/80 border-white/5">
                                                <span className="text-[#D6C7B5] font-bold block">Project Name {i + 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Event Content */
                        <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-2xl border border-white/5 border-dashed bg-white/5">
                            <div className="w-16 h-16 bg-[#B69676]/10 rounded-full flex items-center justify-center mb-6 text-[#B69676]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#D6C7B5] mb-2 break-keep">진행 중인 이벤트가 없습니다</h3>
                            <p className="text-[#D4B483]/60 text-center max-w-md font-light break-keep">
                                현재 예정된 이벤트나 전시 소식이 없습니다.<br />
                                새로운 소식이 있으면 이곳에 업데이트될 예정입니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Review Button (Positioned above the global scroll-to-top button) */}
            <div className={`fixed bottom-24 right-8 z-50 transition-all duration-500 transform ${showButtons ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={() => setIsReviewOpen(true)}
                    className="group flex items-center gap-3 bg-[#B69676] text-[#1C1310] px-4 py-3 rounded-full shadow-2xl hover:bg-[#A68666] transition-all hover:-translate-y-1"
                >
                    <span className="font-bold whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[100px] transition-all duration-300">REVIEW</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            </div>

            {/* Review Overlay */}
            {isReviewOpen && <ContactOverlay onClose={() => setIsReviewOpen(false)} initialMode="review" />}
        </main>
    );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#1C1310] text-[#D6C7B5]">Loading...</div>}>
            <GalleryContent />
        </Suspense>
    );
}
