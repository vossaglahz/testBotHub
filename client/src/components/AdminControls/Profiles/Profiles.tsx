import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BlockIcon from '@mui/icons-material/Block';
import { TbPremiumRights } from 'react-icons/tb';
import { useBlockUserMutation, useSubscribeLawyerMutation } from '../../../store/api/user.api';
import { AlertComponent } from '../../UI/Alert/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetSomeUserQuery } from '../../../store/api/admin.api';
import { ILawyer } from '../../../interfaces/Lawyer.interface';
import { IUser } from '../../../interfaces/User.interface';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import moment from 'moment';
import 'dayjs/locale/ru';
import './Profiles.scss';
import { Loader } from '../../UI/Loader/Loader';
import { useTranslation } from 'react-i18next';

export interface UserInfo {
    id?: number | undefined,
    role?: string;
    name?: string | undefined,
    surname?: string | undefined,
}

export const Profiles = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isActivatedByEmail, setIsActivatedByEmail] = useState<string>('');
    const [isConfirmed, setIsConfirmed] = useState<string>('');
    const [sorted, setSorted] = useState<string>('DESC');
    const [role, setRole] = useState<string>('user');
    const permanentBlock = 'false';
    const [period, setPeriod] = useState<string>('');
    const [alertInfo, setAlertInfo] = useState<{ text: string; isError: boolean }>();
    const navigate = useNavigate();

    const [blockUser] = useBlockUserMutation();
    const [subscribeLawyer] = useSubscribeLawyerMutation();
    const { data, isLoading, error, refetch } = useGetSomeUserQuery({
        currentPage,
        isActivatedByEmail,
        isConfirmed,
        sorted,
        role,
        permanentBlock,
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
        setCurrentPage(1);
        setRole('user');
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
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleBlock = async (id: number | undefined, role: string | undefined, permanentBlocked: boolean, dateBlocked: string | null) => {
        console.log(id, role);
        const response = await blockUser({ id, role, permanentBlocked, dateBlocked });
        if (response.data?.success) {
            setAlertInfo({
                text: t('Panel.profiles.blockSuccess'),
                isError: false,
            });
            refetch();
        } else {
            setAlertInfo({
                text: t('Panel.profiles.blockUnsuccess'),
                isError: true,
            });
        }
    };
    const handleSubscribe = async (id: number | undefined, dateSubscription: string | null) => {
        const response = await subscribeLawyer({ id, dateSubscription });
        if (response.data?.success) {
            setAlertInfo({
                text: t('Panel.profiles.blockSuccess'),
                isError: false,
            });
            refetch();
        } else {
            setAlertInfo({
                text: t('Panel.profiles.blockUnsuccess'),
                isError: true,
            });
        }
    };

    const handleSend = async (user: UserInfo) => {
        navigate('/adminPanel/privateNotifications', { state: { user } });
    };

    return (
        <div className="deal-history">
            <AlertComponent isError={alertInfo?.isError === false} text={alertInfo?.text || ''} status={'success'} />
            <AlertComponent isError={alertInfo?.isError === true} text={alertInfo?.text || ''} status={'error'} />
            <div className="containerPicker">
                <div className="formSelect">
                    <FormControl className="formSelectMenu">
                        <InputLabel id="demo-simple-select-label">{t('Panel.profiles.role')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role}
                            label="Role"
                            onChange={e => {
                                setRole(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <MenuItem value={'user'}>{t('Panel.profiles.people')}</MenuItem>
                            <MenuItem value={'lawyer'}>{t('Panel.profiles.lawyer')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="formSelectMenu" sx={{ marginRight: 0 }}>
                        <InputLabel id="demo-simple-select-label">{t('Panel.profiles.new')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sorted}
                            label="sorted"
                            onChange={e => {
                                setSorted(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <MenuItem value={'DESC'}>{t('Panel.profiles.newest')}</MenuItem>
                            <MenuItem value={'ASC'}>{t('Panel.profiles.oldest')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="formSelectMenu">
                        <InputLabel id="demo-simple-select-label">{t('Panel.profiles.postal')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={isActivatedByEmail}
                            label="Status"
                            onChange={e => {
                                setIsActivatedByEmail(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <MenuItem value={''}>{t('Panel.profiles.all')}</MenuItem>
                            <MenuItem value={'true'}>{t('Panel.profiles.active')}</MenuItem>
                            <MenuItem value={'false'}>{t('Panel.profiles.inactive')}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="formSelectMenu" disabled={role == 'user'}>
                        <InputLabel id="demo-simple-select-label">{t('Panel.profiles.status')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={isConfirmed}
                            label="Status"
                            onChange={e => {
                                setIsConfirmed(e.target.value);
                                setCurrentPage(0);
                            }}
                        >
                            <MenuItem value={''}>{t('Panel.profiles.allAppr')}</MenuItem>
                            <MenuItem value={'true'}>{t('Panel.profiles.approved')}</MenuItem>
                            <MenuItem value={'false'}>{t('Panel.profiles.inapproved')}</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="datePicker">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer sx={{ maxWidth: 200, marginTop: '8px', marginRight: '5px', paddingTop: 0 }} components={['DatePicker']}>
                            <DatePicker
                                label={t('Panel.profiles.blockUntil')}
                                value={period ? dayjs(period) : null}
                                format="DD-MM-YYYY"
                                onChange={e => {
                                    if (e) {
                                        const formattedDate = e.format('YYYY-MM-DD');
                                        setPeriod(formattedDate);
                                    }
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>
            {data.data.length > 0 ? (
                role === 'user' ? (
                    data.data.map((user: IUser) => (
                        <Card key={user.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {user.surname} {user.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{user.email}</Typography>
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleSend(user)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.profiles.write')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(user.id, user.role, true, null)}
                                    className="block-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.toBlock')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(user.id, user.role, true, period)}
                                    className="block-date-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.onTime')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    data.data.map((lawyer: ILawyer) => (
                        <Card key={lawyer.id} className="deal-history-card">
                            <CardContent className="deal-card-content">
                                <Typography sx={{ fontSize: 25 }} className="deal-title">
                                    {lawyer.surname} {lawyer.name}
                                </Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{lawyer.email}</Typography>
                                {lawyer.dateSubscription !== null && (
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: 'rgb(190, 114, 0)' }}>
                                        {moment(lawyer.dateSubscription).utc().format('DD-MM-YYYY')}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions className="deal-card-actions">
                                <Button
                                    onClick={() => handleSend(lawyer)}
                                    className="deal-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<SendIcon />}
                                >
                                    {t('Panel.profiles.write')}
                                </Button>
                                <Button
                                    onClick={() => handleSubscribe(lawyer.id, period)}
                                    className="subsribe-date-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<TbPremiumRights />}
                                >
                                    Подписка
                                </Button>
                                <Button
                                    onClick={() => handleBlock(lawyer.id, lawyer.role, true, null)}
                                    className="block-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.toBlock')}
                                </Button>
                                <Button
                                    onClick={() => handleBlock(lawyer.id, lawyer.role, true, period)}
                                    className="block-date-button"
                                    variant="contained"
                                    size="small"
                                    endIcon={<BlockIcon />}
                                >
                                    {t('Panel.profiles.onTime')}
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )
            ) : (
                <div className="ufo">
                    {t('Panel.profiles.ufo')}
                    <img className="img-pro" src={`/static/ufo.png`} alt="ufo" />
                </div>
            )}
            <Pagination
                className="paginationDealHistory"
                size={isMobile ? 'small' : 'large'}
                count={Math.ceil(data.count / 5)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
            />
            ;
        </div>
    );
};
