export default function SectionF() {
    const testimonials = [
        {
            id: 1,
            text: "Amazing work! The design captured our brand perfectly.",
            author: "Jane Doe",
        },
        {
            id: 2,
            text: "Professional and creative. Highly recommended!",
            author: "John Smith",
        },
        {
            id: 3,
            text: "Transformative results for our business.",
            author: "Alice Johnson",
        },
        {
            id: 4,
            text: "The best agency we've worked with.",
            author: "Michael Brown",
        },
        {
            id: 5,
            text: "Truly innovative solutions.",
            author: "Sarah Lee",
        },
    ];

    return (
        <section className="py-24 bg-transparent relative overflow-hidden backdrop-blur-sm">
            <div className="container mx-auto px-6 mb-16 text-center">
                <span className="text-gray-500 tracking-widest uppercase text-sm font-medium mb-3 block">Reviews</span>
                <h2 className="text-5xl md:text-6xl xl:text-[5.625rem] font-bold text-white mb-6">Testimonials</h2>
            </div>

            <div className="container mx-auto px-6 pb-12">
                <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-8">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className={`
                                snap-center shrink-0 w-[280px] md:w-[320px] 
                                bg-[#FDFDFD] p-4 pb-12 rounded-sm shadow-2xl 
                                transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:z-50
                                ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                                hover:rotate-0
                            `}
                        >
                            {/* Polaroid Photo Area */}
                            <div className="aspect-square bg-neutral-900 mb-6 overflow-hidden relative shadow-inner border-[1px] border-black/5">
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                        <path d="M14.017 21L14.017 18C14.017 16.054 15.372 13.622 18.067 13.622L18.067 19.967C18.067 20.523 17.653 21 17.067 21L14.017 21ZM21 21L21 8.5C21 5.739 18.956 2.5 13.017 2.5L13.017 8.5C14.773 8.5 16.067 10.333 16.067 12L7.017 12C6.461 12 6.017 12.449 6.017 13L6.017 21L2.967 21C2.381 21 1.967 20.523 1.967 19.967L1.967 13.622C4.662 13.622 6.017 16.054 6.017 18L6.017 21L7.017 21L21 21Z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Caption Area */}
                            <p className="text-gray-800 text-base md:text-lg font-medium italic mb-4 leading-relaxed tracking-tight px-1 font-serif">
                                &quot;{item.text}&quot;
                            </p>
                            <div className="flex items-center gap-3 px-1 border-t border-black/5 pt-4">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">— {item.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
