import { useEffect, useState } from 'react';
import { useGetFeedbacksQuery, usePostFeedbackMutation } from '../../store/api/feedback';
import { Button, FormControl, InputLabel, MenuItem, Pagination, Select } from '@mui/material';
import { AlertComponent } from '../UI/Alert/Alert';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { IFeedback } from '../../interfaces/IFeedback.interface';
import { FeedbackOne } from './FeedbackOne';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Box, Modal } from '@mui/material';
import { PostFeedbackModal } from './PostFeedback';
import { useAppSelector } from '../../store/store';
import { useLocation } from 'react-router-dom';
import './Feedback.scss';

dayjs.locale('ru');

export const Feedbacks = () => {
    const { user } = useAppSelector(state => state.users);
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [category, setCategory] = useState<string>('');
    const [votes, setVotes] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [startPeriod, setStartPeriod] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<string>('');
    const [endPeriod, setEndPeriod] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const { data, error, isLoading, refetch } = useGetFeedbacksQuery({
        currentPage, startPeriod, endPeriod, category, votes, status, createdAt
    });
    const [postFeedback, { isError: feedbackError, isSuccess: feedbackSuccess }] = usePostFeedbackMutation();

    const feedbacks = data?.feedbacks || [];
    const feedbacksCount: number = data?.totalCount || 0;
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        refetch();
    }, [location.pathname, feedbackSuccess]);

    if (isLoading) {
        return <div>{t('List.dealList.loading')}</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
        console.log(currentPage);
    };

    const onVoteSuccess = () => {
        refetch();
    };

    const toggleOpen = () => {
        setOpen(prevOpen => !prevOpen);
    };

    return (
        <>
                <div className="deal-list container">
                    <AlertComponent isError={error !== undefined || feedbackError} text={"Пост не создан, повторите попытку"} status={'error'} />
                    <AlertComponent isError={feedbackSuccess} text={"Пост успешно создан"} status={'success'} />
                    <Modal open={open} onClose={toggleOpen}>
                        <Box>
                            <PostFeedbackModal createFeedback={postFeedback} closeModal={toggleOpen} />
                        </Box>
                    </Modal>
                    <div className="formSelect">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer sx={{ maxWidth: 200, marginTop: '8px', marginRight: '5px', paddingTop: 0 }} components={['DatePicker']}>
                        <DatePicker
                            label={t('Aside.deals.from')}
                            value={startPeriod ? dayjs(startPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={e => {
                                if (e) {
                                    const formattedDate = e.format('YYYY-MM-DD');
                                    setStartPeriod(formattedDate);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                    </DemoContainer>
                    <DemoContainer sx={{ maxWidth: 200, marginTop: '8px', marginRight: '5px', paddingTop: 0 }} components={['DatePicker']}>
                        <DatePicker
                            label={t('Aside.deals.to')}
                            value={endPeriod ? dayjs(endPeriod) : null}
                            format="DD-MM-YYYY"
                            onChange={e => {
                                if (e) {
                                    const formattedDate = e.format('YYYY-MM-DD');
                                    setEndPeriod(formattedDate);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                        <FormControl className="formSelectMenu">
                            <InputLabel id="demo-simple-select-label">{"Статус"}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                label="Category"
                                onChange={e => {
                                    setCategory(e.target.value);
                                    setCurrentPage(0);
                                }}
                            >
                                <MenuItem value={''}>{t('List.dealList.typeAll')}</MenuItem>
                                <MenuItem value={'Functionality'}>{"Функциональность"}</MenuItem>
                                <MenuItem value={'Bug'}>{'Баг'}</MenuItem>
                                <MenuItem value={'UI'}>{"UI"}</MenuItem>
                                <MenuItem value={'Performance'}>{"Производительность"}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className="formSelectMenu">
                            <InputLabel id="demo-simple-select-label">{"Категория"}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                label="Status"
                                onChange={e => {
                                    setStatus(e.target.value);
                                    setCurrentPage(0);
                                }}
                            >
                                <MenuItem value={''}>{t('List.dealList.typeAll')}</MenuItem>
                                <MenuItem value={'Idea'}>{"Идея"}</MenuItem>
                                <MenuItem value={'Planned'}>{"Запланировано"}</MenuItem>
                                <MenuItem value={'Processing'}>{"В работе"}</MenuItem>
                                <MenuItem value={'Done'}>{"Завершено"}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className="formSelectMenu">
                        <InputLabel id="demo-simple-select-label">{"Популярность"}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={votes}
                                label="Votes"
                                onChange={e => {
                                setVotes(e.target.value);
                                setCurrentPage(0); 
                                setCreatedAt(''); 
                                }}
                            >
                                <MenuItem value={''}>{t('List.dealList.priceAll')}</MenuItem>
                                <MenuItem value={'HIGHEST'}>{"Высокая"}</MenuItem>
                                <MenuItem value={'LOWEST'}>{"Низкая"}</MenuItem>
                            </Select>
                        </FormControl>
                        {user.role === 'user' ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button className="open-deal-button" variant="contained" onClick={toggleOpen}>
                                    {"Создать пост"}
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button disabled={true} className="open-deal-button" variant="contained" onClick={toggleOpen}>
                                    {"Авторизуйтесь для создание"}
                                </Button>
                            </div>
                        )}
                    </div>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback: IFeedback) => {
                            return (
                                <FeedbackOne
                                    key={feedback.id} 
                                    id={feedback.id}
                                    title={feedback.title}
                                    description={feedback.description}
                                    category={feedback.category}
                                    status={feedback.status}
                                    createdAt={feedback.createdAt}
                                    votes={feedback.votes || []} 
                                    userId={feedback.userId}
                                    clicked={feedback.clicked}
                                    onVoteSuccess={onVoteSuccess}
                                />
                            );
                        })
                    ) : (
                        <div className="empty-show">
                            {'Посты отсуствуют'}
                            <img src={`/static/empty-box.png`} alt="empty-box" />
                        </div>
                    )}
                    <Pagination
                        className="paginationDealHistory"
                        size={isMobile ? 'small' : 'large'}
                        count={Math.ceil(feedbacksCount / 5)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                    ;
                </div>
        </>
    );
};
