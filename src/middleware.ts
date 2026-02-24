import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 로그인 API와 동일한 시크릿 키 사용
const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_cafeina'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // /admin 경로 하위 접근일 때 (로그인 페이지 자체는 제외)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // 토큰 검증
            await jwtVerify(token, secretKey);
            return NextResponse.next();
        } catch (error) {
            // 검증 실패 시 (만료되거나 조작된 경우) 로그인 페이지로 리다이렉트
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
