import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        return NextResponse.json({ error: '파일과 파일 이름이 필요합니다.' }, { status: 400 });
    }

    try {
        // 혹여나 같은 이름의 파일이 덮어쓰기되는 것을 방지하기 위해 파일명 앞에 타임스탬프를 부여합니다.
        const uniqueFilename = `${Date.now()}-${filename}`;

        const blob = await put(uniqueFilename, request.body, {
            access: 'public',
        });

        // 성공 시 반환되는 blob에는 url(저장된 공용 주소)이 포함되어 있습니다.
        return NextResponse.json(blob);
    } catch (error) {
        console.error('Upload Error:', error);
        // Vercel 환경변수 누락 (BLOB_READ_WRITE_TOKEN) 등의 연결 오류 처리
        return NextResponse.json({ error: '파일 업로드 실패 (Vercel Blob 연결 오류)' }, { status: 500 });
    }
}
