export interface FeedbackQuery {
    page: number;
    limit: number;
    startPeriod?: string;
    endPeriod?: string;
    category?: string;
    votes?: string;
    status?: string;
    createdAt?: string;
}