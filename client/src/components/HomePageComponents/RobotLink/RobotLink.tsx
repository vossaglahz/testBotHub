import { Link, useNavigate } from 'react-router-dom';
import './RobotLink.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/store';
interface RobotLinkProps {
    setAlertMessage: (value: boolean) => void;
}

export const RobotLink = ({ setAlertMessage }: RobotLinkProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isClicked, setIsClocked] = useState(false);
    const { user, lawyer } = useAppSelector(state => state.users);

    const handleClick = () => {
        setIsClocked(!isClicked);
    };

    const chatRobotHandleClick = () => {      
        if(user.role || lawyer.role) {
          navigate('/intellectual-robot');  
        } else {
            setAlertMessage(true);
            setTimeout(() => setAlertMessage(false), 3000);
        };
    };

    return (
        <div>
            {isClicked && (
                <div className="links-component">
                    <button className="chat-robot-link" onClick={chatRobotHandleClick}>
                        <p className="chat-robot-link-text">{t('Robot.toRobot')}</p>
                    </button>
                    <Link to={'/lawyer_list'}>
                        <p className="lawyer-page-link">{t('Robot.toLawyer')}</p>
                    </Link>
                </div>
            )}
            <div className="chat-logo" onClick={handleClick}>
                <img className={`logo-robot ${!isClicked ? 'animated' : ''}`} src={`/static/robot-mini.svg`} alt="logo" />
            </div>
        </div>
    );
};
