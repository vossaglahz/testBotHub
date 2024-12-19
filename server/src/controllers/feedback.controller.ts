import { RequestHandler } from 'express';
import { FeedbackService } from '@/services/feedback.service';
import { plainToInstance } from 'class-transformer';
import { PostFeedbackDto } from '@/dto/postFeedback.dto';
import { validate } from 'class-validator';
import { formatErrors } from '@/helpers/formatErrors';
import { FeedbackQuery } from '@/interfaces/FeedbackQuery.interface';

export class FeedbackController {
    private service: FeedbackService;

    constructor() {
        this.service = new FeedbackService();
    }

    getFeedbacks: RequestHandler = async (req, res): Promise<void> => {
        const { refreshToken } = req.cookies;
        const { page, limit, startPeriod, endPeriod, category, votes, status, createdAt } = req.query as unknown as FeedbackQuery;

        const docs = await this.service.getFeebacks(refreshToken, { page, limit, startPeriod, endPeriod, category, votes, status, createdAt });
        res.send(docs);
    };

    postFeedback: RequestHandler = async (req, res): Promise<void> => {
        try {
            const feedbackDto = plainToInstance(PostFeedbackDto, req.body);
            const validationErrors = await validate(feedbackDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const { refreshToken } = req.cookies;
            const feedbacks = await this.service.postFeedback(feedbackDto, refreshToken);
            res.status(201).send(feedbacks);
        } catch (error: any) {
            console.error('Ошибка при создании поста:', error);
            res.status(500).json({ message: error.message });
        }
    };

    voteToFeedback: RequestHandler = async (req, res): Promise<void> => {
        try {
            const { refreshToken } = req.cookies;
            const feedbackId = req.params.id;

            const voteToFeedback = await this.service.voteToFeedback(refreshToken, feedbackId);
            res.status(201).send(voteToFeedback);
        } catch (error: any) {
            console.error('Error in response to deal:', error);
            res.status(500).json({ message: error.message });  
        }
    };
}
