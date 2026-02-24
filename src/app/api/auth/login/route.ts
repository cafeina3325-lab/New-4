import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_cafeina'
);

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: '아이디와 비밀번호를 모두 입력해주세요.' }, { status: 400 });
        }

        let admin = await prisma.admin.findUnique({ where: { username } });

        // 초기 설정용: 등록된 관리자가 한 명도 없고, admin으로 접근 시도할 경우 계정 자동 생성
        if (!admin) {
            const adminCount = await prisma.admin.count();
            if (adminCount === 0 && username === 'admin') {
                const hashedPassword = await bcrypt.hash(password, 10);
                admin = await prisma.admin.create({
                    data: {
                        username: 'admin',
                        passwordHash: hashedPassword,
                        role: 'SUPER_ADMIN',
                    },
                });
                console.log('초기 관리자 계정이 생성되었습니다.');
            } else {
                return NextResponse.json({ error: '잘못된 아이디 또는 비밀번호입니다.' }, { status: 401 });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ error: '잘못된 아이디 또는 비밀번호입니다.' }, { status: 401 });
        }

        // JWT 토큰 생성
        const token = await new SignJWT({ id: admin.id, username: admin.username, role: admin.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secretKey);

        const response = NextResponse.json({ success: true, message: '로그인 성공' });

        // HttpOnly 쿠키에 토큰 저장
        response.cookies.set({
            name: 'admin_token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24시간
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
