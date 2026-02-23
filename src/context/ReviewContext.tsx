"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Review {
    id: number;
    text: string;
    author: string;
    image: string;
    rating: number;
    hideName: boolean;
}

interface ReviewContextType {
    reviews: Review[];
    addReview: (review: Omit<Review, 'id'>) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const initialReviews: Review[] = [
    {
        id: 1,
        text: "첫 타투였는데 상담부터 시술까지 너무 친절하게 해주셨어요. 디자인도 생각했던 것보다 훨씬 예쁘게 나와서 대만족입니다!",
        author: "김지민",
        image: "/Section F/review1.png",
        rating: 5,
        hideName: false
    },
    {
        id: 2,
        text: "섬세한 라인 워크가 정말 인상적입니다. 위생 상태도 철저하고 분위기도 좋아서 편안하게 시술받을 수 있었어요.",
        author: "이준호",
        image: "https://images.unsplash.com/photo-1598371380863-7955c42352fe?q=80&w=800",
        rating: 5,
        hideName: true
    },
    {
        id: 3,
        text: "색감이 정말 예술입니다. 다른 곳에서 실패했던 도안을 완벽하게 커버업해주셨어요. 실력이 정말 대단하십니다.",
        author: "박서연",
        image: "https://images.unsplash.com/photo-1590201777771-0824cf9260c6?q=80&w=800",
        rating: 4,
        hideName: false
    },
    {
        id: 4,
        text: "원하는 느낌을 찰떡같이 알아들으시고 커스텀 도안을 만들어주셨어요. 세상에 하나뿐인 타투를 갖게 되어 기쁩니다!",
        author: "최유진",
        image: "https://images.unsplash.com/photo-1560707303-4e980ce872ad?q=80&w=800",
        rating: 5,
        hideName: true
    },
    {
        id: 5,
        text: "깔끔하고 전문적인 스튜디오입니다. 통증도 생각보다 적었고 결과물도 아주 선명하게 잘 유지되고 있습니다.",
        author: "정민기",
        image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=800",
        rating: 5,
        hideName: false
    },
];

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);

    const addReview = (review: Omit<Review, 'id'>) => {
        const newReview = {
            ...review,
            id: Date.now(),
        };
        setReviews(prev => [newReview, ...prev]);
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
}
