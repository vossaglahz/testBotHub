import { NavLink } from 'react-router-dom';
import { PiKeyLight } from 'react-icons/pi';
import { IoIosArrowForward, IoIosMail } from 'react-icons/io';
import { MdOutlineLockReset } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/store';
import { AlertComponent } from '../UI/Alert/Alert';
import { useState } from 'react';
import { useSendEmailMutation } from '../../store/api/user.api';
import './Security.scss';

export const Security = () => {
    const { t } = useTranslation();
    const { user, lawyer } = useAppSelector(state => state.users);
    const [mailStatus, setMailStatus] = useState<boolean>(false)
    const [sendEmail] = useSendEmailMutation();

    const handleEmail = async () => {
        if (lawyer.refreshToken) {
            await sendEmail(lawyer.refreshToken);
            setMailStatus(true)
            console.log(mailStatus);
        }
    };

    return (
        <>
            <AlertComponent isError={mailStatus} text={"На вашу почту отправлено письмо, активируйте аккаунт"} status={'success'} />
            <div className="security">
                <li>
                    <NavLink to={'/cabinet/change-password'} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <div>
                            <PiKeyLight />
                            {t('Aside.security.password')}
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </NavLink>
                </li>
            </div>
            <br />
            <div className="security">
                <li>
                    <NavLink to={'/cabinet/recover-password'} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <div>
                            <MdOutlineLockReset />
                            {t('Aside.security.passRecovery')}
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </NavLink>
                </li>
            </div>
            <br />
            {(user.isActivatedByEmail == false || lawyer.isActivatedByEmail == false) && (
            <div className="security">
                <li className='security-li'>
                    <div className='security-div'>
                        <div className='security-div2' onClick={handleEmail}>
                            <IoIosMail />
                            Отправить письмо активации
                        </div>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </div>
                </li>
            </div>
            )}
        </>
    );
};
