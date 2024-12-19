import { useNavigate } from 'react-router-dom';
import './RobotLink.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const RobotLink = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isClicked, setIsClocked] = useState(false);

    const handleClick = () => {
        setIsClocked(!isClicked);
    };

    const chatRobotHandleClick = () => {      
          navigate('/intellectual-robot');  
    };

    return (
        <div>
            {isClicked && (
                <div className="links-component">
                    <button className="chat-robot-link" onClick={chatRobotHandleClick}>
                        <p className="chat-robot-link-text">{t('Robot.toRobot')}</p>
                    </button>
                </div>
            )}
            <div className="chat-logo" onClick={handleClick}>
                <img className={`logo-robot ${!isClicked ? 'animated' : ''}`} src={`/static/robot-mini.svg`} alt="logo" />
            </div>
        </div>
    );
};
