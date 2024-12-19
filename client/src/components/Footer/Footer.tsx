import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import './Footer.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className="footer">
            <div className="brandName">
                <h1>Adal zań</h1>
            </div>
            <div className="peopleInfo">
                <div className="ours">
                    <h3>
                        <Link to="/faq">{t('Footer.questions')}</Link>
                    </h3>
                </div>
            </div>
            <div className="socialInfo">
                <a href="https://web.telegram.org/a/#867807515" target="_blank" className="telegramIcon">
                    <FaTelegramPlane />
                </a>
                <a href="https://api.whatsapp.com/send?phone=77072206751" target="_blank" className="instagramIcon">
                    <FaWhatsapp />
                </a>
            </div>
        </div>
    );
};
