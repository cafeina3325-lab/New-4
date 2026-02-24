'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                window.location.href = '/admin'; // Force reload to trigger middleware properly
            } else {
                const data = await res.json();
                setError(data.error || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-sm p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Dashboard</h1>
                    <p className="text-sm text-neutral-400">관리자 계정으로 로그인해주세요.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center break-keep">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5" htmlFor="username">
                            아이디
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                            placeholder="아이디를 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-2.5 px-4 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    );
}
