export default function SectionG() {
    const steps = [
        {
            title: "Consultation",
            desc: "고객님의 방향성과 부위, 스타일을 논의합니다.\n대략적인 구성안과 범위를 안내합니다."
        },
        {
            title: "Design",
            desc: "상담내용을 기반으로 맞춤도안을 제작합니다.\n시술 전 구성과 방향을 최종 확인합니다."
        },
        {
            title: "Procedure",
            desc: "표준화 된 위생 환경에서 시술이 진행됩니다.\n피부 상태와 진행속도에 맞춰 조정됩니다."
        },
        {
            title: "Aftercare",
            desc: "치유과정과 관리방법을 안내합니다.\n필요 시 상태점검 및 리터치 여부를 상담합니다."
        }
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-transparent w-full relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-5xl md:text-6xl xl:text-[5.625rem] font-bold text-center mb-12 text-[#D6C7B5] break-keep">Consultation Flow</h2>
                <div className="flex flex-col items-center space-y-2">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex items-center w-full max-w-5xl h-32 md:h-60 group transition-transform hover:-translate-y-1 duration-300 drop-shadow-md hover:drop-shadow-xl">

                            {/* 1. Badge Hexagon (TITLE) */}
                            <div
                                className="absolute left-0 z-20 h-[116px] w-[134px] md:h-[196px] md:w-[226px] shrink-0 bg-[#6D4C38] flex items-center justify-center shadow-2xl p-1 md:p-2 text-center top-1/2 -translate-y-1/2"
                                style={{
                                    clipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)",
                                    WebkitClipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)"
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                                <span className="text-sm md:text-2xl font-black text-[#D6C7B5] leading-tight break-keep word-keep px-2 md:px-8 tracking-tighter">
                                    {step.title}
                                </span>
                            </div>

                            {/* 2. Content Bar (DESC) with Gradient Border and Depth */}
                            <div
                                className="ml-[10px] flex-1 h-5/6 md:h-3/4 relative z-10 [--indent:28px] md:[--indent:51px]"
                            >
                                {/* Background & Border Layer (Affected by Mask) */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        maskImage: "linear-gradient(to right, black 40%, transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%)"
                                    }}
                                >
                                    {/* Outer Border Layer (Gradient) */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-[#B69676]/60 via-[#B69676] to-[#B69676]/40 p-[1px]"
                                        style={{
                                            clipPath: "polygon(var(--indent) 0%, calc(100% - var(--indent)) 0%, 100% 50%, calc(100% - var(--indent)) 100%, var(--indent) 100%, 0% 50%)",
                                            WebkitClipPath: "polygon(var(--indent) 0%, calc(100% - var(--indent)) 0%, 100% 50%, calc(100% - var(--indent)) 100%, var(--indent) 100%, 0% 50%)"
                                        }}
                                    >
                                        {/* Inner Content Body */}
                                        <div
                                            className="w-full h-full bg-[#3A271D] relative overflow-hidden"
                                            style={{
                                                clipPath: "polygon(var(--indent) 0%, calc(100% - var(--indent)) 0%, 100% 50%, calc(100% - var(--indent)) 100%, var(--indent) 100%, 0% 50%)",
                                                WebkitClipPath: "polygon(var(--indent) 0%, calc(100% - var(--indent)) 0%, 100% 50%, calc(100% - var(--indent)) 100%, var(--indent) 100%, 0% 50%)"
                                            }}
                                        >
                                            {/* Gloss & Shadow Effects for Depth */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Outer Glow Effect */}
                                    <div className="absolute inset-0 bg-[#B69676]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>

                                {/* Text Content Layer (NOT Affected by Mask) */}
                                <div className="absolute inset-0 flex flex-col justify-center items-start text-left pl-[140px] md:pl-[240px] pr-8 md:pr-16 z-20 pointer-events-none">
                                    <p className="text-[#D6C7B5] whitespace-pre-line leading-snug md:leading-relaxed text-[11px] md:text-base font-medium opacity-95 drop-shadow-md pointer-events-auto break-keep max-w-xl">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
