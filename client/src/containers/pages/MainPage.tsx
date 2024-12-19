import { AboutThePlatform } from '../../components/HomePageComponents/AboutThePlatform/AboutThePlatform';
import { FeedBackForm } from '../../components/HomePageComponents/FeedBackForm/FeedBackForm';
import { ForWhoPage } from '../../components/HomePageComponents/ForWhoPage/ForWhoPage';
import { RunningText } from '../../components/HomePageComponents/ForWhoPage/RunningText';
import { PromoBlock } from '../../components/HomePageComponents/PromoBlock/PromoBlock';
import './MainPage.scss';
import { RobotLink } from '../../components/HomePageComponents/RobotLink/RobotLink';
import { AlertComponent } from '../../components/UI/Alert/Alert';
import { useState } from 'react';

export const MainPage = () => {
    const [alertMessage, setAlertMessage] = useState(false);
    
    return (
        <div className="main-wrap">
            <AlertComponent isError={alertMessage} text={'Доступ к чату только для зарегистрированных пользователей!'} status={'error'} />
            <RobotLink setAlertMessage={setAlertMessage} />
            <PromoBlock />
            <RunningText />
            <AboutThePlatform />
            <ForWhoPage />
            <FeedBackForm />
        </div>
    );
};
