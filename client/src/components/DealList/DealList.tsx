import { useEffect, useState } from 'react';
import { useGetDealListQuery } from '../../store/api/dealHistory';
import { Button, FormControl, InputLabel, MenuItem, Pagination, Select } from '@mui/material';
import { AlertComponent } from '../UI/Alert/Alert';
import { DealOne } from './DealOne';
import { IDealListOne } from '../../interfaces/DealList.interface';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/store';
import { IoIosMail, IoMdDocument, IoIosArrowDroprightCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSendEmailMutation } from '../../store/api/user.api';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import './DealList.scss';

dayjs.locale('ru');

export const DealList = () => {
    const { lawyer } = useAppSelector(state => state.users);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [type, setType] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [sendEmail] = useSendEmailMutation();
    const [mailStatus, setMailStatus] = useState<boolean>(false);
    const { data, error, isLoading, refetch } = useGetDealListQuery({
        currentPage,
        type,
        price,
    });

    const deals = data?.deals || [];
    const dealsCount: number = data?.totalCount || 0;
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return <div>{t('List.dealList.loading')}</div>;
    }

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        e.preventDefault();
        setCurrentPage(value);
        window.scrollTo(0, 0);
        console.log(currentPage);
    };

    const onResponseSuccess = () => {
        refetch();
    };

    const handlePremium = () => {
        navigate('/cabinet/payment');
    };

    const handleEmail = async () => {
        if (lawyer.refreshToken) {
            await sendEmail(lawyer.refreshToken);
            setMailStatus(true)
            console.log(mailStatus);
        }
    };

    const handleConfirm = () => {
        navigate('/cabinet/profile');
    };

    return (
        <>
            {lawyer.dateSubscription !== null && lawyer.isActivatedByEmail === true && lawyer.isConfirmed === true ? (
                <div className="deal-list container">
                    <AlertComponent isError={error !== undefined} text={t('List.dealList.createDealError')} status={'error'} />
                    <AlertComponent isError={mailStatus} text={"На вашу почту отправлено письмо, активируйте аккаунт"} status={'success'} />
                    <div className="formSelect">
                        <FormControl className="formSelectMenu">
                            <InputLabel id="demo-simple-select-label">{t('List.dealList.type')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Type"
                                onChange={e => {
                                    setType(e.target.value);
                                    setCurrentPage(0);
                                }}
                            >
                                <MenuItem value={''}>{t('List.dealList.typeAll')}</MenuItem>
                                <MenuItem value={'Criminal'}>{t('List.dealList.criminal')}</MenuItem>
                                <MenuItem value={'Corporate'}>{t('List.dealList.corporate')}</MenuItem>
                                <MenuItem value={'Civil'}>{t('List.dealList.civil')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className="formSelectMenu">
                            <InputLabel id="demo-simple-select-label">{t('List.dealList.price')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={price}
                                label="Price"
                                onChange={e => {
                                    setPrice(e.target.value);
                                    setCurrentPage(0);
                                }}
                            >
                                <MenuItem value={''}>{t('List.dealList.priceAll')}</MenuItem>
                                <MenuItem value={'HIGHEST'}>{t('List.dealList.highest')}</MenuItem>
                                <MenuItem value={'LOWEST'}>{t('List.dealList.lowest')}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {deals.length > 0 ? (
                        deals.map((deal: IDealListOne) => (
                            <DealOne
                                id={deal.id}
                                title={deal.title}
                                type={deal.type}
                                description={deal.description}
                                username={deal.user.name}
                                usersurname={deal.user.surname}
                                city={deal.city}
                                price={deal.price}
                                clicked={deal.clicked}
                                onResponseSuccess={onResponseSuccess}
                            />
                        ))
                    ) : (
                        <div className="empty-show">
                            {t('List.dealList.noOrderHistory')}
                            <img src={`/static/empty-box.png`} alt="empty-box" />
                        </div>
                    )}
                    <Pagination
                        className="paginationDealHistory"
                        size={isMobile ? 'small' : 'large'}
                        count={Math.ceil(dealsCount / 5)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                    ;
                </div>
            ) : lawyer.isActivatedByEmail === false ? (
                <div className="premium-container">
                    <div className="premium">
                        Доступ к заказам доступен только для юристов с активированной почтой
                        <img className="premium-img" src={`/static/postman.png`} alt="postman" />
                    </div>
                    <Button className="wabutton" variant="contained" size="large" endIcon={<IoIosMail />} onClick={handleEmail}>
                        Активировать почту
                    </Button>
                </div>
            ) : lawyer.isConfirmed === false ? (
                <div className="premium-container">
                    <div className="premium">
                        Доступ к заказам доступен только для юристов, предоставивших документы
                        <img className="premium-img" src={`/static/certificate.png`} alt="certificate" />
                    </div>
                    <Button className="wabutton" variant="contained" size="large" endIcon={<IoMdDocument />} onClick={handleConfirm}>
                        Предоставить документы
                    </Button>
                </div>
            ) : lawyer.dateSubscription === null ? (
                <div className="premium-container">
                    <div className="premium">
                        Доступ к заказам доступен только для юристов с подпиской
                        <img className="premium-img" src={`/static/premium.png`} alt="premium" />
                    </div>
                    <Button className="wabutton" variant="contained" size="large" endIcon={<IoIosArrowDroprightCircle />} onClick={handlePremium}>
                        Получить подписку
                    </Button>
                </div>
            ) : null}
        </>
    );
};
