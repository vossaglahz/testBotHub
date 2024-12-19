import { AppDataSource } from '@/config/dataSource';
import { Feedback, FeedbackWithClicked } from '@/entities/feedback.entity';
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
        if (refreshToken) {
            user = await this.manager.findOne(User, { where: { refreshToken } });
        }
    
        const queryBuilder = this.createQueryBuilder('feedback')
            .orderBy('feedback.id', 'DESC');
    
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 5;
    
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
    
        if (filters.startPeriod) {
            queryBuilder.andWhere('feedback.createdAt >= :startPeriod', { startPeriod: new Date(filters.startPeriod) });
        }
    
        if (filters.endPeriod) {
            queryBuilder.andWhere('feedback.createdAt <= :endPeriod', { endPeriod: new Date(filters.endPeriod) });
        }
    
        if (filters.category) {
            queryBuilder.andWhere('feedback.category = :category', { category: filters.category });
        }
    
        if (filters.status) {
            queryBuilder.andWhere('feedback.status = :status', { status: filters.status });
        }
    
        if (filters.votes) {
            if (filters.votes === 'LOWEST') {
                queryBuilder.orderBy('feedback.votes', 'ASC');
            } else if (filters.votes === 'HIGHEST') {
                queryBuilder.orderBy('feedback.votes', 'DESC');
            }
        }
    
        if (filters.createdAt) {
            if (filters.createdAt === 'NEWEST') {
                queryBuilder.orderBy('feedback.createdAt', 'DESC');
            } else if (filters.createdAt === 'OLDEST') {
                queryBuilder.orderBy('feedback.createdAt', 'ASC');
            }
        }
    
        const [feedbacks, totalCount] = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);
    
        const feedbacksWithClickedField: FeedbackWithClicked[] = feedbacks.map(feedback => {
            const feedbackWithClicked = {
                ...feedback,
                clicked: false,
            } as FeedbackWithClicked;
    
            if (user && Array.isArray(feedback.votes)) {
                feedback.votes.find(vote => {
                    if (vote && vote.id === user.id) {
                        feedbackWithClicked.clicked = true;
                    }
                    return false;
                });
            }
    
            return feedbackWithClicked;
        });
    
        return {
            feedbacks: feedbacksWithClickedField,
            totalCount,
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
    
            const userIndex = feedback.votes.findIndex(votes => votes.id === user.id);
            
            if (userIndex !== -1) {
                feedback.votes.splice(userIndex, 1);
            } else {
                const userResponse = {
                    id: user.id
                };
                feedback.votes.push(userResponse);
            }
    
            return await this.save(feedback);
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка запроса на сделку');
        }
    }    
}

export const feedBackRepo = new FeedbackRepository();
