import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_cafeina'
);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, phone, part, genre, referenceText, referenceImages, reservationDate, reservationTime } = data;

        if (!name || !phone || !part || !genre || !reservationDate || !reservationTime) {
            return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
        }

        const reservation = await prisma.reservation.create({
            data: {
                name,
                phone,
                part,
                genre,
                referenceText,
                referenceImages,
                reservationDate,
                reservationTime,
            },
        });

        return NextResponse.json({ success: true, reservation });
    } catch (error) {
        console.error('Reservation submit error:', error);
        return NextResponse.json({ error: '예약 처리 중 서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    // 관리자 인증 확인
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
    }

    try {
        await jwtVerify(token, secretKey);

        // 예약 목록 최신순으로 가져오기
        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error('Reservation fetch error:', error);
        return NextResponse.json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
