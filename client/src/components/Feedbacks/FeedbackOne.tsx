import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { AlertComponent } from '../UI/Alert/Alert';
import { useVoteToFeedbackMutation } from '../../store/api/feedback';
import { IFeedback } from '../../interfaces/IFeedback.interface';
import { useAppSelector } from '../../store/store';
import { format } from 'date-fns';
import './Feedback.scss';

const FeedbackDate = ({ createdAt }: { createdAt: string }) => {
    const formattedDate = format(new Date(createdAt), 'dd MMMM yyyy, HH:mm:ss');
    return <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>{formattedDate}</Typography>;
};

export const FeedbackOne = ({
    id,
    title,
    description,
    category,
    status,
    createdAt,
    clicked,
    userId,
    votes,
    onVoteSuccess,
}: IFeedback & { onVoteSuccess: () => void }) => {
    const [alert, setAlert] = useState<boolean | null>(null);
    const [voteToFeedback] = useVoteToFeedbackMutation();
    const { user } = useAppSelector(state => state.users);

    const onVote = async (id: number) => {
        try {
            await voteToFeedback({ id });
            onVoteSuccess();
            setAlert(true);
        } catch (error) {
            console.error('Ошибка при голосовании на пост:', error);
            setAlert(false);
        }
    };

    useEffect(() => {
        if (alert === true) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const getCategorySet = (status: string) => {
        switch (status) {
            case 'Functionality':
                return { color: '#008d42', text: 'Функциональность' };
            case 'Bug':
                return { color: '#38a0dc', text: 'Баг' };
            case 'UI':
                return { color: '#a4b600', text: 'UI' };
            case 'Performance':
                return { color: 'black', text: 'Производительность' };
            default:
                return { color: 'black', text: '' };
        }
    };
    console.log(userId);

    const getStatusSet = (status: string) => {
        switch (status) {
            case 'Idea':
                return { color: '#008d42', text: 'Идея' };
            case 'Planned':
                return { color: '#38a0dc', text: 'Запланировано' };
            case 'Processing':
                return { color: '#a4b600', text: 'В работе' };
            case 'Done':
                return { color: 'black', text: 'Завершено' };
            default:
                return { color: 'black', text: '' };
        }
    };

    return (
        <Card key={id} className="deal-history-card">
            <AlertComponent isError={alert === false} text={'Ошибка, попробуйте еще раз'} status={'error'} />
            <AlertComponent isError={alert === true} text={'Вы успешно проголосовали'} status={'success'} />
            <CardContent className="deal-card-content">
                <Box>
                    <Typography sx={{ fontSize: 25 }} className="deal-title">
                        {title}
                        </Typography>
                </Box>
                {(() => {
                    const { color, text } = getCategorySet(category);
                    return (
                        <Typography sx={{ color, fontSize: 16 }} key={id + category}>
                            {text}
                        </Typography>
                    );
                })()}
                {(() => {
                    const { color, text } = getStatusSet(status);
                    return (
                        <Typography sx={{ color, fontSize: 16 }} key={id + status}>
                            {text}
                        </Typography>
                    );
                })()}
                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {description}
                </Typography>
                <FeedbackDate createdAt={createdAt} />
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>
                    Лайков: {votes.length}
                </Typography>
            </CardContent>
            <CardActions className="deal-card-actions">
                {user.role === 'user' ? (
                    clicked === false ? (
                        <Button
                            className="deal-button"
                            variant="contained"
                            size="small"
                            endIcon={<SendIcon />}
                            onClick={() => onVote(id)}
                        >
                            Поставить Лайк
                        </Button>
                    ) : (
                        <Button
                            className="deal-button"
                            variant="contained"
                            size="small"
                            endIcon={<SendIcon />}
                            onClick={() => onVote(id)}
                        >
                            Убрать лайк
                        </Button>
                    )
                ) : (
                    <Button
                        disabled={true}
                        className="deal-button"
                        variant="contained"
                        size="small"
                        endIcon={<SendIcon />}
                    >
                        Авторизуйтесь для лайка
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};
