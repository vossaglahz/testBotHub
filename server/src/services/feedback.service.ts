import { PostFeedbackDto } from "@/dto/postFeedback.dto";
import { FeedbackQuery } from "@/interfaces/FeedbackQuery.interface";
import { FeedbackRepository } from "@/repositories/feedback.repository";

export class FeedbackService {
    private repository: FeedbackRepository;

    constructor() {
        this.repository = new FeedbackRepository();
    }

    getFeebacks = async (refreshToken: string, filters: FeedbackQuery) => {
        return await this.repository.getFeedbacks(refreshToken, filters);
    };


    postFeedback = async (feedbackDto: PostFeedbackDto, refreshToken: string) => {
        try {
            return await this.repository.postFeedback(feedbackDto, refreshToken);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка создания поста');
            } else {
                throw new Error('Неизвестная ошибка при создании поста');
            }
        }
    }

    voteToFeedback = async (refreshToken: string, feedbackId: string) => {
        try {
            return await this.repository.voteToFeedback(refreshToken, feedbackId);
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Ошибка запроса на поста');
            } else {
                throw new Error('Неизвестная ошибка при запросе на поста');
            }
        }
    }
}
