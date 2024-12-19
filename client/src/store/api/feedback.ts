import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IFeedback } from '../../interfaces/IFeedback.interface';

export const FeedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK_URL??"/api"}/feedback`,
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: build => ({
        getFeedbacks: build.query<{
            feedbacks: IFeedback[];
            totalCount: number;
        }, {
            currentPage: number;
            startPeriod: string;
            endPeriod: string;
            category: string;
            votes: string;
            status: string;
            createdAt: string;
        }>({
            query: ({ currentPage, startPeriod, endPeriod, category, votes, status, createdAt}) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    startPeriod,
                    endPeriod,
                    category,
                    votes,
                    status,
                    createdAt
                });
                return {
                    url: `?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
        postFeedback: build.mutation({
            query: (data) => ({
                url: '/post',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        voteToFeedback: build.mutation({
            query: (data) => ({
                url: `/vote/${data.id}`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const { useGetFeedbacksQuery, usePostFeedbackMutation, useVoteToFeedbackMutation} = FeedbackApi;