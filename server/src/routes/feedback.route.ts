import { FeedbackController } from '@/controllers/feedback.controller';
import { IRoute } from '@/interfaces/IRoute.interface';
import { authValidate } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkRole';
import { Router } from 'express';

export class FeedbackRoute implements IRoute {
    path = '/feedback';
    router = Router();
    private controller: FeedbackController;

    constructor() {
        this.controller = new FeedbackController();
        this.init();
    }

    private init() {
        this.router.get('/', this.controller.getFeedbacks);
        this.router.post('/post', authValidate, this.controller.postFeedback);
        this.router.post('/vote/:id', authValidate, checkRole('user'), this.controller.voteToFeedback);
    }
}