import { NotificationService } from '@/services/notification.service';
import { NotificationRepo } from '@/repositories/notification.repository';
import { userRepo } from '@/repositories/user.repository';
import { GeneralNotificationDto } from '@/dto/generalNotification.dto';
import { GeneralNotifications } from '@/entities/generalNotification.entity';
import { IQuestionFiltered } from '@/interfaces/IQuestionFiltered.interface';
import { IQuestion } from '@/interfaces/IQuestion.interface';
import { PersonalNotification } from '@/entities/personalNotification.entity';
import { personalNotificationDto } from '@/dto/personalQuestion.dto';
import { RegistrationUserDto } from '@/dto/registration-user.dto';
import { hashPassword } from '@/helpers/hashPassword';
import { generateAccessToken, generateRefreshToken } from '@/helpers/jwtTokens';
import { v4 as uuidv4 } from 'uuid';
import { UserRoles } from '@/interfaces/IUser.inerface';

jest.mock('@/repositories/notification.repository');
jest.mock('@/repositories/user.repository');

describe('NotificationService', () => {
    let service: NotificationService;
    let notificationRepoMock: jest.Mocked<NotificationRepo>;
    let accessToken: string;
    let refreshToken: string;
    let LawRefreshToken: string;
    let LawAcceshToken: string;

    beforeAll(async () => {
        const userPayload: RegistrationUserDto = {
            role: 'user',
            email: 'testuser@example.com',
            password: '123456',
            name: 'mockedUser',
            surname: 'mockedSurName',
            isActivatedByEmail: true,
            activationLink: 'mockedActiveLink',
            refreshToken: null,
            accessToken: null,
        };
        userPayload.password = await hashPassword(userPayload.password);
        userPayload.activationLink = uuidv4();
        accessToken = (await generateAccessToken(userPayload)).accessToken;
        refreshToken = (await generateRefreshToken(userPayload)).refreshToken;
        userPayload.accessToken = accessToken;
        userPayload.refreshToken = refreshToken;

        const lawyerPayload: RegistrationUserDto = {
            role: 'lawyer',
            email: 'testuser@example.com',
            password: '123456',
            name: 'mockedUser',
            surname: 'mockedSurName',
            isActivatedByEmail: true,
            activationLink: 'mockedActiveLink',
            refreshToken: null,
            accessToken: null,
        };
        lawyerPayload.password = await hashPassword(lawyerPayload.password);
        lawyerPayload.activationLink = uuidv4();
        LawAcceshToken = (await generateAccessToken(lawyerPayload)).accessToken;
        LawRefreshToken = (await generateRefreshToken(lawyerPayload)).refreshToken;
        lawyerPayload.accessToken = accessToken;
        lawyerPayload.refreshToken = refreshToken;
    });

    beforeEach(() => {
        notificationRepoMock = new NotificationRepo() as jest.Mocked<NotificationRepo>;
        service = new NotificationService();
        (service as any).repository = notificationRepoMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllNotifications', () => {
        it('should return all notifications', async () => {
            const notifications = {
                generalNotifications: [
                    Object.assign(new GeneralNotifications(), {
                        id: 1,
                        content: 'General notification',
                        topic: 'General',
                        important: false,
                        role: 'user',
                        createdAt: '2024-01-01T00:00:00Z',
                        _createdAt: new Date(),
                    }),
                ],
                personalNotifications: [
                    Object.assign(new PersonalNotification(), {
                        id: 2,
                        content: 'Personal notification',
                        topic: 'Personal',
                        role: 'user',
                        createdAt: '2024-01-01T00:00:00Z',
                        _createdAt: new Date(),
                    }),
                ],
            };

            notificationRepoMock.getAllNotifications.mockResolvedValue(notifications);

            const result = await service.getAllNotifications();
            expect(result).toEqual(notifications);
        });
    });

    describe('getPersonalNotifications', () => {
        it('should return personal notifications for a user', async () => {
            const filters: IQuestionFiltered = { limit: 5, page: 1 };
            const notifications = [
                Object.assign(new GeneralNotifications(), {
                    id: 1,
                    content: 'General notification',
                    topic: 'General',
                    important: false,
                    role: 'user',
                    createdAt: '2024-01-01T00:00:00Z',
                    _createdAt: new Date(),
                }),
            ];
            notificationRepoMock.getPersonalNotifications.mockResolvedValue({
                notifications,
                totalCount: 1,
            });

            const result = await service.getPersonalNotifications(filters, refreshToken);
            expect(result).toEqual({ notifications, totalCount: 1 });
        });
    });

    describe('getGeneralNotifications', () => {
        it('should return general notifications based on user or lawyer role', async () => {
            const filters: IQuestion = { limit: 5, page: 1 };
            const notifications = [
                Object.assign(new GeneralNotifications(), {
                    id: 1,
                    content: 'General notification',
                    topic: 'General',
                    important: false,
                    role: 'user',
                    createdAt: '2024-01-01T00:00:00Z',
                    _createdAt: new Date(),
                }),
            ];
            jest.spyOn(userRepo, 'findUserByRefreshToken').mockResolvedValue({
                id: 0,
                name: 'mockedUser',
                surname: 'mockedSurName',
                email: 'testuser@example.com',
                password: '123456',
                patronymicName: 'mockedName',
                isActivatedByEmail: true,
                activationLink: 'mockedActiveLink',
                refreshToken: refreshToken,
                accessToken: accessToken,
                viewedNotifications: '[]',
                role: 'user',
                photo: 'mocked.png',
                avgRating: 5,
                personalNotification: [],
                rating: [],
                dateBlocked: null,
                city: 'Almaty',
                about: 'Just a boy',
                permanentBlocked: false,
                requests: [],
            });

            notificationRepoMock.getGeneralNotifications.mockResolvedValue({
                notifications,
                totalCount: 1,
            });

            const result = await service.getGeneralNotifications(filters, refreshToken);
            expect(result).toEqual({ notifications, totalCount: 1 });
        });
    });

    describe('postGeneralNotification', () => {
        it('should send a general notification successfully', async () => {
            const notificationDto: GeneralNotificationDto = {
                content: 'New general notification',
                important: false,
                topic: 'mocked Topic',
                sourceLink: 'https://youtu.be/bJ_DyMckh78?si=Qgza3CAjJZ5HQgY1',
            };
            const targetAudience = 'all';
            const response = { message: 'Ваше уведомление успешно отправлено всем' };

            notificationRepoMock.postGeneralNotification.mockResolvedValue(response);

            const result = await service.postGeneralNotification(notificationDto, targetAudience);
            expect(result).toEqual(response);
            expect(notificationRepoMock.postGeneralNotification).toHaveBeenCalledWith(notificationDto, targetAudience);
        });
    });

    describe('postQuestion', () => {
        it('should post a personal question successfully', async () => {
            const questionDto: personalNotificationDto = {
                topic: 'topic',
                content: 'content',
                questionId: 5,
                sourceLink: 'example link',
                userId: null,
                lawyerId: null
            };

            const response = { message: 'Question posted successfully' };
            notificationRepoMock.postQuestion.mockResolvedValue(response);

            const result = await service.postQuestion(refreshToken, questionDto);
            expect(result).toEqual(response);
            expect(notificationRepoMock.postQuestion).toHaveBeenCalledWith(refreshToken, questionDto);
        });
    });

    describe('getUnreadNotificationsCount', () => {
        it('should return the count of unread notifications', async () => {
            const mockedData = { unreadPersonalCount: 5, unreadGeneralCount: 6, totalUnreadCount: 11, }

            notificationRepoMock.getUnreadNotificationsCount.mockResolvedValue(mockedData);

            const result = await service.getUnreadNotificationsCount(refreshToken);
            expect(result).toEqual(mockedData);
            expect(notificationRepoMock.getUnreadNotificationsCount).toHaveBeenCalledWith(refreshToken);
        });
    });

    describe('markAsViewedPersonal', () => {
        it('should mark a personal notification as viewed', async () => {
            const notificationId = 1;

            notificationRepoMock.markPersonalNotifications.mockResolvedValue(undefined);

            await service.markAsViewedPersonal(notificationId);
            expect(notificationRepoMock.markPersonalNotifications).toHaveBeenCalledWith(notificationId);
        });
    });

    describe('markAsViewedGeneral', () => {
        it('should mark a general notification as viewed for a user', async () => {
            const notificationId = 1;
            const user = {
                id: 0,
                name: 'mockedUser',
                surname: 'mockedSurName',
                email: 'testuser@example.com',
                isActivatedByEmail: true,
                activationLink: 'mockedActiveLink',
                refreshToken: refreshToken,
                accessToken: accessToken,
                viewedNotifications: '[]',
                role: UserRoles.user,
                photo: 'mocked.png',
                avgRating: 5,
                personalNotification: [],
                rating: [],
                dateBlocked: null,
                city: 'Almaty',
                about: 'Just a boy',
                permanentBlocked: false,
                requests: [],
            };

            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(user);

            notificationRepoMock.markNotificationAsViewedForUser.mockResolvedValue({message: 'уведомление было просмотрено'});

            await service.markAsViewedGeneral(notificationId, refreshToken);

            expect(userRepo.findByRefreshToken).toHaveBeenCalledWith(refreshToken);
            expect(notificationRepoMock.markNotificationAsViewedForUser).toHaveBeenCalledWith(notificationId, refreshToken);
        });

        it('should mark a general notification as viewed for a lawyer', async () => {
            const notificationId = 2;

            const lawyer = {
                id: 0,
                name: 'mockedUser',
                surname: 'mockedSurName',
                email: 'testuser@example.com',
                password: '123456',
                patronymicName: 'mockedName',
                isActivatedByEmail: true,
                activationLink: 'mockedActiveLink',
                refreshToken: LawRefreshToken,
                accessToken: LawAcceshToken,
                viewedNotifications: '[]',
                role: 'lawyer',
                photo: 'mocked.png',
                avgRating: 5,
                personalNotification: [],
                rating: [],
                dateBlocked: null,
                city: 'Almaty',
                about: 'Just a boy',
                permanentBlocked: false,
                requests: [],
            };

            (userRepo.findByRefreshToken as jest.Mock).mockResolvedValue(lawyer);

            notificationRepoMock.markNotificationAsViewedForLawyer.mockResolvedValue({message: 'уведомление было просмотрено'});

            const response = await service.markAsViewedGeneral(notificationId, LawRefreshToken);

            expect(response).toEqual({message: 'уведомление было просмотрено'});
        });

        it('should throw an error if the user is not found', async () => {
            const notificationId = 3;
            const refreshToken = 'invalidToken';

            jest.spyOn(userRepo, 'findByRefreshToken').mockResolvedValue(null);

            await expect(service.markAsViewedGeneral(notificationId, refreshToken)).rejects.toThrow('Пользователь не найден');
        });
    });
});