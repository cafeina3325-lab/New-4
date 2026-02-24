import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { author, password, rating, text, imageUrl, isAnonymous } = body;

        // 필수 필드 검증 (이름, 별점)
        if (!author || rating === undefined || rating === null) {
            return NextResponse.json({ error: '이름과 별점은 필수 입력 사항입니다.' }, { status: 400 });
        }

        // 비밀번호 해싱 (입력된 경우에만)
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // DB에 리뷰 생성
        const newReview = await prisma.review.create({
            data: {
                author,
                password: hashedPassword,
                rating: Number(rating),
                text: text || null,
                imageUrl: imageUrl || null,
                isAnonymous: isAnonymous ?? false,
            }
        });

        // 보안상 비밀번호는 클라이언트로 반환하지 않음
        const { password: _, ...reviewWithoutPassword } = newReview;

        return NextResponse.json({ success: true, review: reviewWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error('Review create error:', error);
        return NextResponse.json({ error: '리뷰 등록 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                author: true,
                rating: true,
                text: true,
                imageUrl: true,
                isAnonymous: true,
                createdAt: true,
                // 비밀번호(password) 필드는 제외하고 전송
            }
        });

        return NextResponse.json({ success: true, reviews }, { status: 200 });
    } catch (error) {
        console.error('Review fetch error:', error);
        return NextResponse.json({ error: '리뷰 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
