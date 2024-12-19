import { useTranslation } from 'react-i18next';
import './PromoBlock.scss';

export const PromoBlock = () => {
    const { t } = useTranslation();
    return (
        <div className="promo-block-wrapper container">
            <div className="promo-block-img">
                <img
                    src={`/static/main_logo_bird.png`}
                    alt="promo-logo"
                />
            </div>
            <div className="promo-block-description">
                <h2>{t('MainPromoTitle.title')}</h2>
            </div>
        </div>
    );
};
