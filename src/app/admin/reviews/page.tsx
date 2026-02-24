'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Review = {
    id: string;
    author: string;
    rating: number;
    text: string | null;
    imageUrl: string | null;
    isAnonymous: boolean;
    createdAt: string;
};

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    setError('리뷰 목록을 불러오지 못했습니다.');
                }
            } else {
                setError('리뷰 목록을 불러오지 못했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: string, author: string) => {
        if (!confirm(`정말로 ${author}님의 리뷰를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;

        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setReviews((prev) => prev.filter((r) => r.id !== id));
            } else {
                const data = await res.json();
                alert(`삭제 실패: ${data.error || '알 수 없는 오류'}`);
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">리뷰 관리</h1>
                    <p className="text-neutral-400">웹사이트에 등록된 고객 리뷰(후기) 목록입니다.</p>
                </div>
                <Link href="/admin" className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium">
                    대시보드로 돌아가기
                </Link>
            </div>

            {error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">{error}</div>
            ) : isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-neutral-600 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-xl">
                    등록된 후기가 없습니다.
                </div>
            ) : (
                <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="text-xs uppercase bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th scope="col" className="px-6 py-4">등록일시</th>
                                <th scope="col" className="px-6 py-4">작성자(닉네임)</th>
                                <th scope="col" className="px-6 py-4">별점</th>
                                <th scope="col" className="px-6 py-4">내용</th>
                                <th scope="col" className="px-6 py-4">첨부 이미지</th>
                                <th scope="col" className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((rev) => (
                                <tr key={rev.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(rev.createdAt).toLocaleDateString()} {new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        {rev.author}
                                        {rev.isAnonymous && <span className="ml-2 text-xs font-normal text-neutral-500 bg-neutral-800 px-2 py-1 rounded">익명처리됨</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700 fill-neutral-700"}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="max-w-md line-clamp-2 text-neutral-400" title={rev.text || ''}>
                                            {rev.text || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {rev.imageUrl ? (
                                            <a href={rev.imageUrl} target="_blank" rel="noopener noreferrer" className="block relative w-12 h-12 rounded border border-neutral-700 overflow-hidden hover:opacity-80 transition-opacity">
                                                <Image src={rev.imageUrl} alt="Review attachment" fill className="object-cover" />
                                            </a>
                                        ) : (
                                            <span className="text-neutral-600 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(rev.id, rev.author)}
                                            className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors whitespace-nowrap"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
