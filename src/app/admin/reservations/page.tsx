'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reservation } from '@prisma/client';
import ConsentModal from '@/components/admin/ConsentModal';

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/reservations');
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            } else {
                setError('예약 목록을 불러오지 못했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setReservations((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
                );
            } else {
                alert('상태 변경에 실패했습니다.');
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`정말로 ${name}님의 예약 내역을 삭제하시겠습니까?`)) return;

        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setReservations((prev) => prev.filter((r) => r.id !== id));
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (err) {
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">예약 관리</h1>
                    <p className="text-neutral-400">웹사이트에서 접수된 상담 예약 내역입니다.</p>
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
            ) : reservations.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-xl">
                    접수된 예약 내역이 없습니다.
                </div>
            ) : (
                <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="text-xs uppercase bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                            <tr>
                                <th scope="col" className="px-6 py-4">접수일시</th>
                                <th scope="col" className="px-6 py-4">이름</th>
                                <th scope="col" className="px-6 py-4">연락처</th>
                                <th scope="col" className="px-6 py-4">희망 부위 / 장르</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">예약 희망일시</th>
                                <th scope="col" className="px-6 py-4">상태</th>
                                <th scope="col" className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(res.createdAt).toLocaleDateString()} {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{res.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{res.phone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-block px-2 py-0.5 bg-neutral-800 rounded text-xs w-max">{res.part}</span>
                                            <span className="inline-block px-2 py-0.5 bg-[#B69676]/20 text-[#D4B483] rounded text-xs w-max">{res.genre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                                        {res.reservationDate}<br />
                                        <span className="text-neutral-500 font-normal">{res.reservationTime}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={res.status}
                                            onChange={(e) => handleStatusChange(res.id, e.target.value)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${res.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                res.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}
                                        >
                                            <option value="PENDING" className="bg-neutral-900 text-white">대기중</option>
                                            <option value="CONFIRMED" className="bg-neutral-900 text-white">예약확정</option>
                                            <option value="CANCELLED" className="bg-neutral-900 text-white">취소됨</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedReservation(res)}
                                                className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors whitespace-nowrap"
                                            >
                                                상세보기/동의서
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res.id, res.name)}
                                                className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors whitespace-nowrap"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedReservation && (
                <ConsentModal
                    reservation={selectedReservation}
                    onClose={() => setSelectedReservation(null)}
                />
            )}
        </div>
    );
}
