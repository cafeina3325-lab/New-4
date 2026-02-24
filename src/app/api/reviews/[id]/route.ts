import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_cafeina'
);

// 관리자 여부 확인 헬퍼
async function isAdmin(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return false;
    try {
        await jwtVerify(token, secretKey);
        return true;
    } catch {
        return false;
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const admin = await isAdmin(request);

        // 요청 바디 파싱 시도 (비밀번호 추출용)
        let body = {};
        try {
            body = await request.json();
        } catch {
            // body가 빈 경우 무시
        }
        const { password } = body as { password?: string };

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 1. 관리자인 경우: 비밀번호 무시하고 강제 삭제
        if (!admin) {
            // 2. 관리자가 아닌 작성자 본인 삭제 시도인 경우
            if (!review.password) {
                return NextResponse.json({ error: '비밀번호가 설정되지 않은 리뷰는 관리자만 삭제 가능합니다.' }, { status: 403 });
            }
            if (!password) {
                return NextResponse.json({ error: '리뷰 삭제를 위해 비밀번호를 입력해주세요.' }, { status: 400 });
            }

            const isPasswordValid = await bcrypt.compare(password, review.password);
            if (!isPasswordValid) {
                return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
            }
        }

        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ success: true, message: '리뷰가 삭제되었습니다.' }, { status: 200 });

    } catch (error) {
        console.error('Review delete error:', error);
        return NextResponse.json({ error: '리뷰 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { password, rating, text, imageUrl } = body;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return NextResponse.json({ error: '리뷰를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 수정은 보안상 작성자 본인만 가능하게 막음 (관리자도 텍스트 임의 조작 불가)
        if (!review.password) {
            return NextResponse.json({ error: '비밀번호가 없는 리뷰는 수정할 수 없습니다.' }, { status: 403 });
        }
        if (!password) {
            return NextResponse.json({ error: '리뷰 수정을 위해 본인 확인(비밀번호)이 필요합니다.' }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, review.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 필수 항목(별점) 검증
        if (rating === undefined || rating === null) {
            return NextResponse.json({ error: '별점은 필수 입력 사항입니다.' }, { status: 400 });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                rating: Number(rating),
                text: text !== undefined ? text : review.text,
                imageUrl: imageUrl !== undefined ? imageUrl : review.imageUrl,
            }
        });

        const { password: _, ...reviewWithoutPassword } = updatedReview;

        return NextResponse.json({ success: true, review: reviewWithoutPassword }, { status: 200 });

    } catch (error) {
        console.error('Review update error:', error);
        return NextResponse.json({ error: '리뷰 수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
