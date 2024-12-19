import { PiExclamationMarkFill } from 'react-icons/pi';
import { INotify } from '../../../interfaces/Notifications.interface';
import ModalComponent from '../../UI/Modal/Modal';
import { useState } from 'react';
import './Notification.scss';
import {
    useGetUnreadNotificationsCountQuery,
    useMarkGeneralAsViewedMutation,
    useMarkPersonalAsViewedMutation,
} from '../../../store/api/notifications.api';
import { useTranslation } from 'react-i18next';

export const Notification = ({
    topic,
    content,
    _createdAt,
    important,
    isPrivate,
    id,
    sourceLink,
    isViewed,
    refetched,
    viewedNotify,
    setNotify
}: INotify & { isPrivate: string; refetched: () => void, viewedNotify: number[], setNotify: (id: number) => void }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markGeneralAsViewed] = useMarkGeneralAsViewedMutation();
    const [markPersonalAsViewed] = useMarkPersonalAsViewedMutation();
    const { refetch } = useGetUnreadNotificationsCountQuery();

    const handleOpen = async (id: number) => {
        try {
            setIsModalOpen(true);
            if (isPrivate === 'general') {
                await markGeneralAsViewed({ notificationId: id }).unwrap();
            } else if (isPrivate === 'personal') {
                await markPersonalAsViewed({ notificationId: id }).unwrap();
            }
            refetch();
            refetched();
            setNotify(id);
        } catch (e) {
            console.error(e);
        }
    };
    const handleClose = () => setIsModalOpen(false);

    const newNotify = <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: 'orange' }}></div>

    return (
        <div className="notification">
            <div className="notification__flex">
                <div className="notification__icon">
                    <PiExclamationMarkFill color={important ? 'red' : '#4c75a3'} />
                </div>
                <div className="notification__content">
                    <p>
                        <b>{topic}</b>
                    </p>
                    <p className="content">{content}</p>
                </div>
                <div className='not_viewed'>
                    {isPrivate === 'personal' ? (
                        isViewed ? null : ( newNotify ) 
                    ) : isPrivate === 'general' ? ( !viewedNotify.includes(parseInt(id || '')) ? newNotify : null ) : null}
                    </div>
            </div>
            <div className="notification__check">
                <div className="notification__check-wrapper">
                    <p>{_createdAt}</p>
                </div>
                    <button onClick={() => handleOpen(parseInt(id || ''))}>{t('Aside.notifics.info')}</button>
                    <ModalComponent topic={topic} content={content} open={isModalOpen} onClose={handleClose} sourceLink={sourceLink} />
            </div>
        </div>
    );
};