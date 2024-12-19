import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Pagination, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useApproveDocMutation, useGetAllRequestsQuery, useRejectDocMutation } from '../../../store/api/admin.api';
import './DataEdit.scss';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export type TEdit = {
    id: number;
    type: string;
    data: {
        name: string;
        surname: string;
        patronymicName: string;
        lawyerType: string;
        caseCategories: string[];
        photo: string;
        about: string;
        city: string;
    };
    isApproved: boolean;
    createdAt: string;
    approvedAt: null | Date;
};

export const DataEdit = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(1);
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL??"/api"}/uploads/`;

    const [approveDoc] = useApproveDocMutation();
    const [rejectDoc] = useRejectDocMutation();
    const { data, isLoading, error, refetch } = useGetAllRequestsQuery({
        page
    });
    
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setPage(1);
        refetch();
    }, [location.pathname]);

    if (isLoading) {
        return <Loader />;
    }
    if (error || !data) {
        return <div>Ошибка сервера</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setPage(value);
        window.scrollTo(0, 0);
    };

    const onApproveHandler = async (id: number) => {
        await approveDoc({ id });
        refetch();
    };

    const onRejectHandler = async (id: number) => {
        await rejectDoc({ id });
        refetch();
    };

    return (
        <div className="deal-history">
            {data?.data.length > 0 ? (
                <>
                    {data?.data.map(user => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.name')}: {user.data.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.surname')}: {user.data.surname}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.patrName')}: {user.data.patronymicName ? user.data.patronymicName : 'Не заполнено'}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {t('Panel.data.section')}:
                                    {user.data.lawyerType.length > 0 && Array.isArray(user.data.lawyerType)
                                        ? user.data.lawyerType.map(item => <p>{item}</p>)
                                        : t('Panel.data.noData')}
                                </Typography>
                                <Typography className="deal-description" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {t('Panel.data.lawyerType')}:{' '}
                                    {user.data.caseCategories.length > 0 && Array.isArray(user.data.caseCategories)
                                        ? user.data.caseCategories.map(item => <p>{item}</p>)
                                        : t('Panel.data.noData')}
                                </Typography>
                                <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                    {t('Panel.data.photo')}:
                                    <CardMedia
                                        component="img"
                                        width="100"
                                        height="100"
                                        image={
                                            user.data.photo
                                                ? `${BASE_URL}${user.data.photo}`
                                                : `/static/no-image.png`
                                        }
                                        sx={{ borderRadius: '6px', width: { xs: '100%', sm: 100 } }}
                                        alt={user.data.photo}
                                    />
                                </Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => onApproveHandler(user.id)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.data.approve')}
                                </Button>
                                <Button
                                    onClick={() => onRejectHandler(user.id)}
                                    className="reject-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.data.reject')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </>
            ) : (
                <div className="empty-show">
                    {t('Panel.data.noUsers')}
                    <img src={`/static/empty-box.png`} alt="empty-box" />
                </div>
            )}
             <Pagination
                        className="paginationDealHistory"
                        size={isMobile ? 'small' : 'large'}
                        count={Math.ceil(data.count / 5)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                    ;
        </div>
    );
};
