import GlassHexagon from "../ui/GlassHexagon";
import Image from "next/image";
import Link from "next/link";

export default function SectionC() {
    const events = [
        { id: 1, title: "Event 1", desc: "Limited Edition", image: "https://placehold.co/600x600/1a1a1a/FFF?text=Event+1" },
        { id: 2, title: "Event 2", desc: "Special Offer", image: "https://placehold.co/600x600/2a2a2a/FFF?text=Event+2" },
        { id: 3, title: "Event 3", desc: "New Arrival", image: "https://placehold.co/600x600/333333/FFF?text=Event+3" },
        { id: 4, title: "Event 4", desc: "Artist Collab", image: "https://placehold.co/600x600/444444/FFF?text=Event+4" },
        { id: 5, title: "Event 5", desc: "Seasonal Style", image: "https://placehold.co/600x600/555555/FFF?text=Event+5" },
    ];

    return (
        <section id="section-c" className="py-20 md:py-40 min-h-[80vh] flex flex-col justify-center bg-transparent relative">
            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#A89B8C] tracking-widest uppercase text-sm font-medium mb-3 block">Monthly Drops</span>
                    <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold text-[#D6C7B5] mb-6 break-keep">이달의 이벤트</h2>
                    <p className="text-[#A89B8C] break-keep">매월 새로운 소식을 전합니다</p>
                </div>

                {/* Horizontal Scroll Image Cards Area (Structural Visibility Fix) */}
                <div className="relative mb-24 mx-8 md:mx-24 lg:mx-40 bg-white/[0.03] backdrop-blur-md rounded-[3rem] overflow-hidden min-h-[280px] md:min-h-[460px] lg:min-h-[580px] flex items-center">

                    {/* Central Lighting Layer (Stronger Backlight) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

                    {/* 2. Scrollable Content Layer (Added vertical padding) */}
                    <div className="flex overflow-x-auto w-full py-12 gap-8 md:gap-12 snap-x snap-mandatory scrollbar-hide px-8 md:px-24 relative z-30 items-center min-w-0">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                href="/gallery?tab=Event"
                                className="block snap-center shrink-0 transition-all duration-500 hover:-translate-y-6 hover:z-20 relative cursor-pointer"
                            >
                                <GlassHexagon
                                    width="w-[160px] md:w-[210px] lg:w-[280px] xl:w-[320px]"
                                    height="h-[200px] md:h-[265px] lg:h-[350px] xl:h-[380px]"
                                    className="relative group shrink-0"
                                    doubleBorder={true}
                                >
                                    {/* Image Background */}
                                    <div className="absolute inset-0 z-0 h-full w-full">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover opacity-85 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-6 lg:p-10">
                                        <span className="text-[9px] lg:text-xs font-bold text-[#A89B8C] tracking-[0.2em] uppercase mb-1 lg:mb-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            monthly drop
                                        </span>
                                        <h3 className="text-lg lg:text-3xl font-bold text-white mb-1 lg:mb-2">{event.title}</h3>
                                        <p className="text-[10px] lg:text-base text-gray-300 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">{event.desc}</p>
                                    </div>
                                </GlassHexagon>
                            </Link>
                        ))}
                    </div>

                    {/* 3. Overlay Layer (Enhanced inner shadow for maximum depth) */}
                    <div className="absolute inset-0 pointer-events-none z-30 rounded-[3rem] shadow-[inset_0_0_180px_rgba(0,0,0,1)] md:shadow-[inset_0_0_250px_rgba(0,0,0,1)] xl:shadow-[inset_0_0_350px_rgba(0,0,0,1)]" />
                </div>
            </div>

            {/* Information Card (Notion) */}
            <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-4 md:p-8 border-white/5">
                <h3 className="text-base md:text-xl font-bold text-[#D6C7B5] mb-3 md:mb-6 border-b border-white/10 pb-3 md:pb-4 inline-block">Notion</h3>
                <ul className="space-y-2 text-[#A89B8C] list-disc list-inside text-[0.65rem] md:text-base leading-relaxed break-keep">
                    <li>이달의 이벤트 도안은 한정기간 동안만 진행됩니다.</li>
                    <li>예약 마감 시 조기 종료 될 수 있습니다.</li>
                    <li>갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다.</li>
                    <li>피부상태·부위·에이징에 따라 표현이 달라질 수 있습니다.</li>
                </ul>
            </div>
        </section>
    );
}
