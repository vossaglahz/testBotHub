import { AppDataSource } from '@/config/dataSource';
import { Feedback } from '@/entities/feedback.entity';
import { User } from '@/entities/user.entity';
import { FeedbackQuery } from '@/interfaces/FeedbackQuery.interface';
import { Repository } from 'typeorm';
import { PostFeedbackDto } from '@/dto/postFeedback.dto';

export class FeedbackRepository extends Repository<Feedback> {
    constructor() {
        super(Feedback, AppDataSource.createEntityManager());
    }

    async getFeedbacks(refreshToken: string, filters: FeedbackQuery) {
        let user = null;
        user = await this.manager.findOne(User, { where: { refreshToken } });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const queryBuilder = this.createQueryBuilder('feedbacks')
            .orderBy('feedbacks.id', 'DESC');

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;

        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);

        if (filters.startPeriod) {
            queryBuilder.andWhere('feedbacks.createdAt >= :startPeriod', { startPeriod: new Date(filters.startPeriod) });
        }

        if (filters.endPeriod) {
            queryBuilder.andWhere('feedbacks.createdAt <= :endPeriod', { endPeriod: new Date(filters.endPeriod) });
        }

        if (filters.category) {
            queryBuilder.andWhere('feedbacks.category = :category', { type: filters.category });
        }

        if (filters.status) {
            queryBuilder.andWhere('feedbacks.status = :status', { status: filters.status });
        }

        if (filters.votes) {
            if (filters.votes === 'LOWEST') {
                queryBuilder.orderBy('feedbacks.votes', 'ASC');
            } else if (filters.votes === 'HIGHEST') {
                queryBuilder.orderBy('feedbacks.votes', 'DESC');
            }
        }

        if (filters.createdAt) {
            if (filters.createdAt === 'NEWEST') {
                queryBuilder.orderBy('feedbacks.createdAt', 'DESC');
            } else if (filters.createdAt === 'OLDEST') {
                queryBuilder.orderBy('feedbacks.createdAt', 'ASC');
            }
        }

        const [feedbacks, totalCount] = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);

        return {
            feedbacks,
            totalCount
        };
    }

    async postFeedback(feedbackDto: PostFeedbackDto, refreshToken: string) {
        try {
            const user = await this.manager.findOne(User, { where: { refreshToken } });

            if (!user) throw new Error('Пользователь не найден');

            const feedback = new Feedback();
            feedback.title = feedbackDto.title;
            feedback.description = feedbackDto.description;
            feedback.status = feedbackDto.status;
            feedback.category = feedbackDto.category;
            feedback.userId = user.id;

            return await this.save(feedback);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка создания поста');
        }
    }

    async voteToFeedback(refreshToken: string, feedbackId: string) {
        try {
            const user = await this.manager.findOne(User, { where: { refreshToken } });
            if (!user) throw new Error('Пользователь не найден');

            const feedback = await this.manager.findOne(Feedback, {
                where: { id: Number(feedbackId) },
            });
            if (!feedback) throw new Error('Сделка не найдена');

            feedback.votes = feedback.votes || [];
            feedback.votes = feedback.votes.filter(votes => votes !== null);

            const userExists = feedback.votes.some(votes => votes.id === user.id);
            if (userExists) throw new Error('Вы уже проголосовали на этот пост');

            const userResponse = {
                id: user.id
            };

            feedback.votes.push(userResponse);

            return await this.save(feedback);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка запроса на сделку');
        }
    }
}

export const feedBackRepo = new FeedbackRepository();
