import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const pendingReservations = await prisma.reservation.count({
        where: { status: 'PENDING' }
    });

    const totalReviews = await prisma.review.count();

    return (
        <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">대시보드</h1>
                    <p className="text-neutral-400">Flying Studio 관리자 페이지입니다.</p>
                </div>
                <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium">
                        로그아웃
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-xl font-semibold mb-2 text-white">예약 관리</h2>
                        <p className="text-neutral-400 text-sm mb-6 break-keep">고객들의 예약 요청을 확인하고 상태를 관리합니다.</p>
                        <div className="text-4xl font-bold text-white mb-6">
                            {pendingReservations}
                            <span className="text-base font-normal text-neutral-500 ml-2">건 대기중</span>
                        </div>
                        <Link
                            href="/admin/reservations"
                            className="inline-block w-full py-2 bg-[#B69676] hover:bg-[#A68666] text-[#1C1310] text-center rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                            예약 내역 보기
                        </Link>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">갤러리 리스트</h2>
                    <p className="text-neutral-400 text-sm mb-6 break-keep">새로운 타투 작업물을 갤러리에 추가하고 관리합니다.</p>
                    <div className="text-4xl font-bold text-white mb-4">0<span className="text-lg font-normal text-neutral-500 ml-1">개</span></div>
                    <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors">새 포트폴리오 업로드</button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-xl font-semibold mb-2 text-white">리뷰 관리</h2>
                        <p className="text-neutral-400 text-sm mb-6 break-keep">고객들이 남긴 소중한 리뷰를 확인하고 공개를 관리합니다.</p>
                        <div className="text-4xl font-bold text-white mb-6">
                            {totalReviews}
                            <span className="text-base font-normal text-neutral-500 ml-2">건 누적</span>
                        </div>
                        <Link
                            href="/admin/reviews"
                            className="inline-block w-full py-2 bg-[#B69676] hover:bg-[#A68666] text-[#1C1310] text-center rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                            리뷰 내역 보기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
