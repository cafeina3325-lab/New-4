"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useReviews } from "@/context/ReviewContext";

// Constants
const parts = [
    "Head", "Face", "Neck", "Shoulder", "Chest",
    "Belly", "Back", "Arm", "Leg", "Hand", "Foot"
];

const genres = [
    "Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork",
    "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."
];

export default function ContactOverlay({
    onClose,
    initialMode = 'selection'
}: {
    onClose: () => void;
    initialMode?: 'selection' | 'reservation' | 'review';
}) {
    const [viewMode, setViewMode] = useState<'selection' | 'reservation' | 'review'>(initialMode);

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [referenceText, setReferenceText] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    // Review State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Date Generation (Next 14 days)
    const dates = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            result.push(d);
        }
        return result;
    }, []);

    // Time Slots Generation (10:00 - 18:30, 30 min interval)
    const timeSlots = useMemo(() => {
        const slots = [];
        let start = 10 * 60; // 10:00 in minutes
        const end = 18 * 60 + 30; // 18:30 in minutes

        while (start <= end) {
            const h = Math.floor(start / 60);
            const m = start % 60;
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            slots.push(timeString);
            start += 30;
        }
        return slots;
    }, []);

    // Handlers
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        let formatted = raw;
        if (raw.length > 3 && raw.length <= 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else if (raw.length > 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }
        setPhone(formatted);
    };

    const handleSingleSelection = (item: string, current: string | null, setCurrent: (v: string | null) => void) => {
        if (current === item) {
            setCurrent(null); // Toggle off
        } else {
            setCurrent(item);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        if (!name || !phone || !selectedPart || !selectedGenre || !selectedDate || !selectedTime) {
            alert("필수 항목(이름, 연락처, 부위, 장르, 날짜, 시간)을 모두 입력해주세요.");
            return;
        }

        const formData = {
            name,
            phone,
            part: selectedPart,
            genre: selectedGenre,
            referenceText,
            files: files.map(f => f.name),
            date: selectedDate.toLocaleDateString(),
            time: selectedTime
        };

        console.log("Reservation Request:", formData);
        alert(`[${name}]님, 상담 예약이 접수되었습니다. \n(실제 서버 전송은 구현되지 않았습니다.)`);
        onClose();
    };

    const { addReview } = useReviews();

    const handleReviewSubmit = () => {
        if (!name || !reviewText) {
            alert("보호자 성함(또는 닉네임)과 후기 내용을 입력해주세요.");
            return;
        }

        // Using a high-quality placeholder image if no file is selected
        const reviewData = {
            author: name,
            rating: reviewRating,
            text: reviewText,
            image: "https://images.unsplash.com/photo-1590201777771-0824cf9260c6?q=80&w=800",
            hideName: isAnonymous
        };

        addReview(reviewData);
        alert("소중한 후기가 접수되었습니다. 감사합니다!");
        onClose();
    };

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border-white/5 bg-[#1C1310]/95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 z-10 bg-[#1C1310]/80 backdrop-blur-md text-[#D6C7B5]">
                    <div className="flex items-center gap-4">
                        {viewMode === 'reservation' && (
                            <button
                                onClick={() => setViewMode('selection')}
                                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h2 className="text-2xl font-bold break-keep">
                            {viewMode === 'selection' ? 'Contact' : viewMode === 'reservation' ? 'Reservation Form' : 'Review Form'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {viewMode === 'selection' && (
                    /* Selection View */
                    <div className="p-12 flex flex-col md:flex-row items-center justify-center gap-8 min-h-[400px]">
                        <button
                            onClick={() => setViewMode('reservation')}
                            className="group relative w-full md:w-64 h-64 bg-white/5 hover:bg-[#B69676]/10 border border-white/10 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:border-[#B69676]/30 hover:-translate-y-2"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#B69676]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-[#B69676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-[#D6C7B5] uppercase tracking-widest break-keep">Reservation</span>
                            <span className="text-xs text-[#D4B483] text-center px-6 break-keep">상담 예약 신청하기</span>
                        </button>

                        <button
                            onClick={() => setViewMode('review')}
                            className="group relative w-full md:w-64 h-64 bg-white/5 hover:bg-[#B69676]/10 border border-white/10 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:border-[#B69676]/30 hover:-translate-y-2"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#B69676]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-[#B69676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-[#D6C7B5] uppercase tracking-widest break-keep">Review</span>
                            <span className="text-xs text-[#D4B483] text-center px-6 break-keep">작품 리뷰 남기기</span>
                        </button>
                    </div>
                )}

                {viewMode === 'reservation' && (
                    /* Reservation View (Form) */
                    <>
                        <div className="overflow-y-auto p-6 md:p-8 space-y-12 text-[#D4B483] scrollbar-hide">
                            {/* Notice Section */}
                            <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-[#B69676] uppercase tracking-widest mb-3">Notice</h3>
                                <ul className="space-y-2 text-sm text-[#D4B483]/70 list-disc list-inside leading-relaxed break-keep">
                                    <li>본 접수는 <strong>대면상담 예약</strong>입니다. 시술 예약이 아닙니다.</li>
                                    <li>상담 결과에 따라 시술이 제한되거나 거절될 수 있습니다.</li>
                                    <li><strong>만 19세 미만</strong>은 시술이 불가하며, 대면 상담 시 신분증 확인이 필요합니다.</li>
                                    <li>피부상태, 건강상태, 시술 이력에 따라 상담 또는 시술이 제한 될 수 있습니다.</li>
                                </ul>
                            </section>

                            {/* 1. Basic Info */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">1</span>
                                    Basic Info <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">* Required</span>
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#D4B483] mb-2">Name <span className="text-[#B69676]">*</span></label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="실명기입"
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B69676]/20 transition-all text-[#D6C7B5] placeholder-[#D4B483]/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#D4B483] mb-2">Phone <span className="text-[#B69676]">*</span></label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="010-0000-0000"
                                            maxLength={13}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B69676]/20 transition-all text-[#D6C7B5] placeholder-[#D4B483]/30"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* 2. Area */}
                                <section>
                                    <h3 className="text-xl font-bold text-[#D6C7B5] mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">2</span>
                                        Area <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">* Single choice</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {parts.map(part => (
                                            <button
                                                key={part}
                                                onClick={() => handleSingleSelection(part, selectedPart, setSelectedPart)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedPart === part
                                                    ? "bg-[#B69676] text-[#1C1310] border-[#B69676] shadow-md"
                                                    : "bg-white/5 text-[#D4B483] border-white/10 hover:border-[#B69676]/30 hover:text-[#D6C7B5]"
                                                    }`}
                                            >
                                                {part}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. Genres */}
                                <section>
                                    <h3 className="text-xl font-bold text-[#D6C7B5] mb-4 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">3</span>
                                        Genres <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">* Single choice</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => handleSingleSelection(genre, selectedGenre, setSelectedGenre)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedGenre === genre
                                                    ? "bg-[#B69676] text-[#1C1310] border-[#B69676] shadow-md"
                                                    : "bg-white/5 text-[#D4B483] border-white/10 hover:border-[#B69676]/30 hover:text-[#D6C7B5]"
                                                    }`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* 4. Reference */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">4</span>
                                    Reference
                                </h3>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-[#B69676]/20 rounded-xl p-8 text-center hover:bg-[#B69676]/5 transition-colors relative">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="pointer-events-none">
                                            <svg className="w-10 h-10 text-[#D4B483]/60 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-[#D4B483]/60 text-sm font-medium">Click or Drag images here</p>
                                            {files.length > 0 && (
                                                <p className="text-[#B69676] text-sm mt-2">{files.length} filed(s) selected</p>
                                            )}
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder="추가적인 설명이나 요청사항을 자유롭게 적어주세요."
                                        value={referenceText}
                                        onChange={(e) => setReferenceText(e.target.value)}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B69676]/20 transition-all min-h-[120px] resize-y text-[#D6C7B5] placeholder:text-[#D4B483]/30"
                                    />
                                    <p className="text-xs text-[#D4B483]/40 text-right break-keep">* 레퍼런스는 참고용 이며, 피부 / 부위에 따라 조정 될 수 있습니다.</p>
                                </div>
                            </section>

                            {/* 5. Schedule */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">5</span>
                                    Schedule <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">Date Selection (2 weeks)</span>
                                </h3>

                                {/* Date Grid */}
                                <div className="grid grid-cols-7 gap-2 mb-6">
                                    {/* Days Header */}
                                    {daysOfWeek.map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-[#D4B483]/50 py-2">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Empty Slots for alignment */}
                                    {Array.from({ length: dates[0].getDay() }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}

                                    {/* Date Items */}
                                    {dates.map((date, i) => {
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setSelectedTime(null); // Reset time when date changes
                                                }}
                                                className={`
                                                    flex flex-col items-center justify-center p-3 rounded-lg transition-all
                                                    ${isSelected
                                                        ? "bg-[#B69676] text-[#1C1310] shadow-md transform scale-[1.05]"
                                                        : "bg-white/5 text-[#D4B483]/70 hover:bg-[#B69676]/10"
                                                    }
                                                `}
                                            >
                                                <span className="text-xs mb-1 opacity-60">{date.getMonth() + 1}.</span>
                                                <span className={`text-lg font-bold ${dayOfWeekColor(date.getDay(), isSelected)}`}>
                                                    {date.getDate()}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Time Slots (Only show if date selected) */}
                                {selectedDate && (
                                    <div className="animate-fade-in">
                                        <h4 className="text-sm font-bold text-white mb-3">
                                            Available Time <span className="font-normal text-gray-500">({selectedDate.toLocaleDateString()})</span>
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                            {timeSlots.filter(time => {
                                                if (!selectedDate) return false;

                                                const now = new Date();
                                                const isToday = selectedDate.toDateString() === now.toDateString();

                                                if (!isToday) return true;

                                                // Calculate cutoff time: Now + 1 hour 45 minutes
                                                const cutoff = new Date(now.getTime() + (1 * 60 + 45) * 60000);

                                                const [hours, minutes] = time.split(':').map(Number);
                                                const slotTime = new Date(selectedDate);
                                                slotTime.setHours(hours, minutes, 0, 0);

                                                return slotTime > cutoff;
                                            }).map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-1 rounded-md text-sm font-medium transition-colors border ${selectedTime === time
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Footer / Submit */}
                        <div className="p-6 border-t border-white/5 bg-[#1C1310]/80 backdrop-blur-md sticky bottom-0 z-10 flex justify-end gap-4">
                            <button
                                onClick={() => setViewMode('selection')}
                                className="px-6 py-3 text-[#D4B483]/60 font-bold hover:text-[#D6C7B5] transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`px-8 py-3 bg-[#B69676] text-[#1C1310] font-bold rounded-lg shadow-lg hover:bg-[#A68666] hover:shadow-xl transition-all ${(!name || !phone || !selectedDate || !selectedTime || !selectedPart || !selectedGenre) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                예약하기
                            </button>
                        </div>
                    </>
                )}

                {viewMode === 'review' && (
                    /* Review View (Form) */
                    <>
                        <div className="overflow-y-auto p-6 md:p-8 space-y-12 text-[#D4B483] scrollbar-hide">
                            {/* Review Content */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">1</span>
                                    Review Info <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">* Required</span>
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#D4B483] mb-2">Name / Nickname <span className="text-[#B69676]">*</span></label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="성함 또는 닉네임"
                                                className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B69676]/20 transition-all text-[#D6C7B5] placeholder-[#D4B483]/30"
                                            />
                                            <button
                                                onClick={() => setIsAnonymous(!isAnonymous)}
                                                className={`flex items-center gap-2 px-4 py-4 rounded-xl border transition-all ${isAnonymous ? 'bg-[#B69676] text-[#1C1310] border-[#B69676]' : 'bg-white/5 text-[#D4B483] border-white/10'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isAnonymous ? 'bg-[#1C1310] border-[#1C1310]' : 'border-[#D4B483]/50'}`}>
                                                    {isAnonymous && <div className="w-2 h-2 bg-[#B69676] rounded-full" />}
                                                </div>
                                                <span className="text-sm font-bold">익명(성** 표시)</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#D4B483] mb-2">Rating <span className="text-[#B69676]">*</span></label>
                                        <div className="flex gap-2 p-4 bg-white/5 border border-white/10 rounded-xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setReviewRating(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <svg
                                                        className={`w-10 h-10 ${star <= reviewRating ? 'text-[#B69676] fill-[#B69676]' : 'text-[#D4B483]/20 fill-white/5'}`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                            <span className="ml-4 text-[#B69676] font-bold self-center text-xl">{reviewRating}.0</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Work Proof */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-4 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">2</span>
                                    Work Proof <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">Upload tattoo photo</span>
                                </h3>
                                <div className="border-2 border-dashed border-[#B69676]/20 rounded-xl p-12 text-center hover:bg-[#B69676]/5 transition-colors relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="pointer-events-none">
                                        <svg className="w-12 h-12 text-[#D4B483]/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-[#D4B483]/60 font-medium">Click or Drag your tattoo work photo</p>
                                        {files.length > 0 && (
                                            <p className="text-[#B69676] font-bold mt-2">{files.length} file(s) selected</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Review Content */}
                            <section>
                                <h3 className="text-xl font-bold text-[#D6C7B5] mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B69676] text-[#1C1310] text-xs">3</span>
                                    Content <span className="text-[#D4B483]/50 text-sm font-normal ml-auto">* Required</span>
                                </h3>
                                <div className="space-y-4">
                                    <textarea
                                        placeholder="시술 결과나 만족도 등 소중한 경험을 들려주세요."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B69676]/20 transition-all min-h-[200px] resize-y text-[#D6C7B5] placeholder:text-[#D4B483]/30"
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer / Submit */}
                        <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md sticky bottom-0 z-10 flex justify-end gap-4">
                            <button
                                onClick={() => setViewMode('selection')}
                                className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleReviewSubmit}
                                className={`px-8 py-3 bg-[#B69676] text-[#1C1310] font-bold rounded-lg shadow-lg hover:bg-[#A68666] hover:shadow-xl transition-all ${(!name || !reviewText) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                리뷰 등록하기
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function dayOfWeekColor(dayIndex: number, isSelected: boolean) {
    if (isSelected) return "text-current"; // Inherit text color if selected (black)
    if (dayIndex === 0) return "text-red-400"; // Sunday
    if (dayIndex === 6) return "text-blue-400"; // Saturday
    return "text-current";
}
