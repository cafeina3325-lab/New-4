"use client";

import { useRef, useState, useEffect } from "react";

type Review = {
    id: string;
    author: string;
    rating: number;
    text: string | null;
    imageUrl: string | null;
    isAnonymous: boolean;
    createdAt: string;
};

export default function SectionF() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragged, setIsDragged] = useState(false);

    // Modal State
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete'>('view');
    const [password, setPassword] = useState('');
    const [editRating, setEditRating] = useState(5);
    const [editText, setEditText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setReviews(data.reviews);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setIsDragged(false);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setTimeout(() => setIsDragged(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        setIsDragged(true);
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도 조절
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const formatName = (name: string, hide: boolean) => {
        if (!hide) return name;
        return name.charAt(0) + "**";
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const handleReviewClick = (e: React.MouseEvent, review: Review) => {
        if (isDragged) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        setSelectedReview(review);
        setModalMode('view');
        setPassword('');
        setEditRating(review.rating);
        setEditText(review.text || '');
    };

    const handleCloseModal = () => {
        setSelectedReview(null);
        setModalMode('view');
        setPassword('');
    };

    const handleDelete = async () => {
        if (!password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/reviews/${selectedReview?.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                alert("리뷰가 삭제되었습니다.");
                setReviews(prev => prev.filter(r => r.id !== selectedReview?.id));
                handleCloseModal();
            } else {
                const data = await res.json();
                alert(`삭제 실패: ${data.error}`);
            }
        } catch (e) {
            alert("삭제 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/reviews/${selectedReview?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, rating: editRating, text: editText })
            });
            if (res.ok) {
                alert("리뷰가 수정되었습니다.");
                const data = await res.json();
                setReviews(prev => prev.map(r => r.id === selectedReview?.id ? data.review : r));
                handleCloseModal();
            } else {
                const data = await res.json();
                alert(`수정 실패: ${data.error}`);
            }
        } catch (e) {
            alert("수정 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
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
                            onClick={(e) => handleReviewClick(e, item)}
                            className={`
                                snap-center shrink-0 w-[280px] md:w-[320px]
                                bg-[#FDFDFD] p-4 pb-12 rounded-sm shadow-2xl cursor-pointer
                                transition-all duration-500 hover:-translate-y-8 hover:scale-110 hover:z-50
                                ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                                hover:rotate-0
                            `}
                        >
                            {/* Polaroid Photo Area */}
                            <div className="aspect-[4/5] bg-neutral-900 mb-6 overflow-hidden relative shadow-inner border-[1px] border-black/5">
                                <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1590201777771-0824cf9260c6?q=80&w=800"}
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
                            <p className="text-gray-800 text-sm md:text-base font-medium italic mb-6 leading-relaxed tracking-tight px-1 font-serif min-h-[4.5rem] break-keep line-clamp-3">
                                &quot;{item.text || "소중한 후기를 남겨주셨습니다."}&quot;
                            </p>
                            <div className="flex items-center justify-between px-1 border-t border-black/5 pt-4">
                                <p className="text-[#A89B8C] text-[10px] font-bold uppercase tracking-widest">— {formatName(item.author, item.isAnonymous)}</p>
                                <span className="text-[#8c7e6c] font-bold text-[11px] tracking-wider">{formatDate(item.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Review Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={handleCloseModal}>
                    <div className="bg-[#1C1310] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#261A15]">
                            <h3 className="text-xl font-bold text-[#D6C7B5]">리뷰 상세</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            {modalMode === 'view' && (
                                <div className="space-y-6">
                                    {selectedReview.imageUrl && (
                                        <div className="relative w-full rounded-xl overflow-hidden bg-black/50 border border-white/5">
                                            <img src={selectedReview.imageUrl} alt="Review" className="w-full h-auto object-cover max-h-[50vh]" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-[#D6C7B5] text-lg">{formatName(selectedReview.author, selectedReview.isAnonymous)} 님</p>
                                            <p className="text-xs text-[#A89B8C] mt-1">{formatDate(selectedReview.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-1 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < selectedReview.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600 fill-gray-600'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    {selectedReview.text && (
                                        <p className="text-[#D4B483] whitespace-pre-wrap leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                                            {selectedReview.text}
                                        </p>
                                    )}
                                    <div className="flex gap-2 pt-6 border-t border-white/10">
                                        <button onClick={() => setModalMode('edit')} className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">수정</button>
                                        <button onClick={() => setModalMode('delete')} className="flex-1 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors border border-red-500/20">삭제</button>
                                    </div>
                                </div>
                            )}

                            {modalMode === 'delete' && (
                                <div className="space-y-6">
                                    <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <h4 className="text-lg font-bold text-white mb-2">정말로 리뷰를 삭제하시겠습니까?</h4>
                                        <p className="text-[#D4B483] text-sm break-keep">리뷰 작성 시 설정한 4자리 비밀번호를 입력해주세요.</p>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="비밀번호 4자리"
                                        maxLength={4}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#261A15] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500/50 outline-none text-center tracking-widest text-lg"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setModalMode('view')} className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">취소</button>
                                        <button onClick={handleDelete} disabled={isSubmitting || !password} className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-colors disabled:opacity-50">삭제하기</button>
                                    </div>
                                </div>
                            )}

                            {modalMode === 'edit' && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                                        <p className="text-[#D4B483] text-sm text-center break-keep">작성자 본인 확인을 위해 비밀번호를 입력해주세요.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#A89B8C] mb-2">비밀번호</label>
                                        <input
                                            type="password"
                                            placeholder="비밀번호 4자리"
                                            maxLength={4}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[#261A15] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#B69676]/50 outline-none mb-4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#A89B8C] mb-2">별점</label>
                                        <div className="flex gap-2 p-3 bg-[#261A15] border border-white/10 rounded-xl">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setEditRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                                                    <svg className={`w-8 h-8 ${star <= editRating ? 'text-amber-500 fill-amber-500' : 'text-white/10 fill-white/10'}`} viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#A89B8C] mb-2">리뷰 수정</label>
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full min-h-[120px] bg-[#261A15] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-[#B69676]/50 outline-none resize-y"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <button onClick={() => setModalMode('view')} className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">취소</button>
                                        <button onClick={handleEdit} disabled={isSubmitting || !password} className="flex-1 py-3 rounded-lg bg-[#B69676] hover:bg-[#A68666] text-[#1C1310] font-bold transition-colors disabled:opacity-50">저장하기</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </section >
    );
}
