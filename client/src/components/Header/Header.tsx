import { useState, useRef, useEffect } from 'react';
import {
    Badge,
    Button,
    Drawer,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Popper,
    Select,
    SelectChangeEvent,
    Typography,
    Fade,
    List,
    ListItem,
    useMediaQuery,
    useTheme,
    ClickAwayListener,
} from '@mui/material';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { useLogoutUserMutation } from '../../store/api/user.api';
import { useGetUnreadNotificationsCountQuery } from '../../store/api/notifications.api';
import { setLoading } from '../../store/slice/auth.slice';
import './Header.scss';

export const Header = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const { user, lawyer } = useAppSelector(state => state.users);
    const [language, setLanguage] = useState('ru');
    const arrowRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [logoutUser] = useLogoutUserMutation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data } = useGetUnreadNotificationsCountQuery();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
    };

    const handleLogout = async () => {
        try {
            if (user.refreshToken) {
                const refreshToken = user.refreshToken;
                dispatch(setLoading(true));
                await logoutUser({ refreshToken }).unwrap();
                dispatch(setLoading(false));
                localStorage.removeItem('token');
                navigate('/');
            } else if (lawyer.refreshToken) {
                const refreshToken = lawyer.refreshToken;
                await logoutUser({ refreshToken }).unwrap();
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        const lang = localStorage.getItem('i18nextLng');
        if (lang) setLanguage(lang);
        document.documentElement.lang = language;
    }, [language]);

    const toggleDrawer = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    const renderUserGreeting = (user: { name?: string; role?: string }) => {
        if (user.name) {
            return <></>;
        } else {
            return (
                <Link to={'/login'}>
                    <Typography style={{ color: 'white' }} className="layoutButtonText" component="h1">
                        {t('Authorization.button.login')}
                    </Typography>
                </Link>
            );
        }
    };

    return (
        <div className="layoutWrapper">
            <div className="container">
                <div className="layoutNavBlock">
                    <div className="mainTitleBlock">
                        <Link to={'/'}>
                            <div className="logo-part">
                                <img className="logo-pic" src={`/static/logoeagle.png`} alt="logo" />
                                <h1 className="logo-name">Adal zań</h1>
                            </div>
                        </Link>
                    </div>
                    {!isMobile ? (
                        <div className="btnAuth">
                            <div className="ours">
                                <NavLink to={'/lawyer_list'}>{t('Footer.lawyersList.title')}</NavLink>
                            </div>
                            {renderUserGreeting(user)}
                            <FormControl>
                                <Select
                                    className="layoutSelectLanguage"
                                    value={language}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value={'ru'}>RU</MenuItem>
                                    <MenuItem value={'kz'}>KZ</MenuItem>
                                </Select>
                            </FormControl>

                            {user.id && (
                                <>
                                    <PopupState variant="popper" popupId="demo-popup-popper">
                                        {popupState => (
                                            <div>
                                                <Button variant="text" {...bindToggle(popupState)}>
                                                    <PersonIcon style={{ color: 'white' }} fontSize="large" />
                                                </Button>
                                                {popupState.isOpen && (
                                                    <ClickAwayListener onClickAway={() => popupState.close()}>
                                                        <Popper {...bindPopper(popupState)} transition placement="bottom-end">
                                                            {({ TransitionProps }) => (
                                                                <Fade {...TransitionProps} timeout={350}>
                                                                    <Paper className="paper__content">
                                                                        <div ref={arrowRef} className="popper-arrow" />
                                                                        {user.role === 'admin' ? (
                                                                            <>
                                                                                <Link
                                                                                    className="burgerNavigation"
                                                                                    to={'/adminPanel/profiles'}
                                                                                    onClick={() => popupState.close()}
                                                                                >
                                                                                    {t('List.adminPanel')}
                                                                                </Link>
                                                                                <Link className="burgerNavigation" to={'/'} onClick={handleLogout}>
                                                                                    {t('List.exit')}
                                                                                </Link>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Link
                                                                                    className="link"
                                                                                    to={'/cabinet/profile'}
                                                                                    onClick={() => popupState.close()}
                                                                                >
                                                                                    {t('List.cabinet')}
                                                                                </Link>
                                                                                <Link
                                                                                    className="link"
                                                                                    to={'/cabinet/dealHistory'}
                                                                                    onClick={() => popupState.close()}
                                                                                >
                                                                                    {t('Aside.deals.title')}
                                                                                </Link>

                                                                                {user.role === 'lawyer' && (
                                                                                    <>
                                                                                        <Link
                                                                                            className="link"
                                                                                            to={'/dealList'}
                                                                                            onClick={() => popupState.close()}
                                                                                        >
                                                                                            {t('List.dealList.title')}
                                                                                        </Link>
                                                                                        <Link
                                                                                            className="link"
                                                                                            to={'/todo'}
                                                                                            onClick={() => popupState.close()}
                                                                                        >
                                                                                            {t('List.todo.title')}
                                                                                        </Link>
                                                                                    </>
                                                                                )}
                                                                                <Link
                                                                                    className="link"
                                                                                    to={'/chat'}
                                                                                    onClick={() => popupState.close()}
                                                                                >
                                                                                    {t('List.chat')}
                                                                                </Link>
                                                                                <Link className="link" to={'/'} onClick={handleLogout}>
                                                                                    {t('List.exit')}
                                                                                </Link>
                                                                            </>
                                                                        )}
                                                                    </Paper>
                                                                </Fade>
                                                            )}
                                                        </Popper>
                                                    </ClickAwayListener>
                                                )}
                                            </div>
                                        )}
                                    </PopupState>
                                    {user.role !== 'admin' && (
                                        <Link to={'/cabinet/notifications'}>
                                            <IconButton style={{ color: 'white', transform: 'scale(1.2)' }}>
                                                <Badge badgeContent={0} color="error">
                                                    <NotificationsNoneIcon />{' '}
                                                    {data?.totalUnreadCount ? (
                                                        <div className="notification_count">{data?.totalUnreadCount}</div>
                                                    ) : null}
                                                </Badge>
                                            </IconButton>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
                                <MenuIcon className="menuIcon" />
                            </IconButton>

                            <Drawer anchor="right" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                                <List>
                                    <ListItem>{renderUserGreeting(user)}</ListItem>
                                    <ListItem>
                                        <FormControl fullWidth>
                                            <Select
                                                value={language}
                                                onChange={handleChange}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value={'ru'}>RU</MenuItem>
                                                <MenuItem value={'kz'}>KZ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </ListItem>
                                    <ListItem>
                                        <Link onClick={() => setIsDrawerOpen(false)} className="burgerNavigation" to={'/lawyer_list'}>
                                            {t('Footer.lawyersList.title')}
                                        </Link>
                                    </ListItem>
                                    {user.id && user.role !== 'admin' ? (
                                        <>
                                            <ListItem>
                                                <Link className="burgerNavigation" to={'/cabinet/profile'}>
                                                    {t('List.cabinet')}
                                                </Link>
                                            </ListItem>
                                            {user.role === 'user' ? (
                                                <>
                                                    <ListItem>
                                                        <Link className="burgerNavigation" to={'/cabinet/dealHistory'}>
                                                            {t('Aside.deals.title')}
                                                        </Link>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Link className="burgerNavigation" to={'/chat'}>
                                                            {t('List.chat')}
                                                        </Link>
                                                    </ListItem>
                                                </>
                                            ) : null}
                                            {user.role === 'lawyer' ? (
                                                <>
                                                    <ListItem>
                                                        <Link onClick={() => setIsDrawerOpen(false)} className="burgerNavigation" to={'/todo'}>
                                                            {t('List.todo.title')}
                                                        </Link>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Link onClick={() => setIsDrawerOpen(false)} className="burgerNavigation" to={'/dealList'}>
                                                            {t('List.dealList.title')}
                                                        </Link>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Link onClick={() => setIsDrawerOpen(false)} className="burgerNavigation" to={'/chat'}>
                                                            {t('List.chat')}
                                                        </Link>
                                                    </ListItem>
                                                </>
                                            ) : null}
                                            <ListItem component={Button} onClick={handleLogout}>
                                                {t('List.exit')}
                                            </ListItem>
                                        </>
                                    ) : null}
                                    {user.id && user.role === 'admin' ? (
                                        <>
                                            <ListItem>
                                                <Link className="burgerNavigation" to={'/adminPanel/profiles'}>
                                                    {t('List.adminPanel')}
                                                </Link>
                                            </ListItem>
                                            <ListItem component={Button} onClick={handleLogout}>
                                                {t('List.exit')}
                                            </ListItem>
                                        </>
                                    ) : null}
                                </List>
                            </Drawer>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
