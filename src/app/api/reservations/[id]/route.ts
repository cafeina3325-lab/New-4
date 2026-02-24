import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_cafeina'
);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
    }

    try {
        await jwtVerify(token, secretKey);

        const data = await request.json();
        const { status } = data;
        const { id } = await params;

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ success: true, reservation: updatedReservation });
    } catch (error) {
        console.error('Reservation update error:', error);
        return NextResponse.json({ error: '상태 변경 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
    }

    try {
        await jwtVerify(token, secretKey);
        const { id } = await params;

        await prisma.reservation.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reservation delete error:', error);
        return NextResponse.json({ error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
