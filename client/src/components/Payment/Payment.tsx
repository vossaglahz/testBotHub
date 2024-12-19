import { Button } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import moment from 'moment';
import { useAppSelector } from "../../store/store";
import "./Payment.scss";

const handleSend = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B77072206751&text&type=phone_number&app_absent=0", "_blank");
}

export const Payment = () => {
    const { lawyer } = useAppSelector(state => state.users);
    return (
        <>
        <div className="payment">
            <img 
                className="qr" 
                src={`/static/payment-qr.jpg`} 
                alt="Payment QR" 
            />
            <Button
                className="wa-button"
                variant="contained"
                size="large"
                endIcon={<PeopleAltIcon />}
                onClick={handleSend}
            >
                Отправить чек на WhatsApp
            </Button>
        </div>
        <div className="subscription-status">
            <h2>Активная подписка:</h2>
            {lawyer.dateSubscription !== null ? (
                <div className="subscription-item active-subscription">
                    {moment(lawyer.dateSubscription).utc().format('DD-MM-YYYY')}
                </div>
            ) : (
                <div className="subscription-item active-subscription">
                    Нет активной подписки
                </div>
            )}
        </div>
        <div className="subscription">
            <h2>Стоимость подписки</h2>
            <div className="subscription-list">
                <div className="subscription-item">1 месяц: 5 000 тг</div>
                <div className="subscription-item">3 месяца: 12 000 тг</div>
                <div className="subscription-item">6 месяцев: 20 000 тг</div>
            </div>
        </div>
        <div className="instruction">
            <h2>Как оплатить через QR-код:</h2>
            <ol className="instruction-list">
                <li>1. Откройте приложение Kaspi на вашем смартфоне.</li>
                <li>2. Выберите функцию сканирования QR-кодов.</li>
                <li>3. Наведите камеру на QR-код, представленный выше.</li>
                <li>4. Проверьте информацию и подтвердите платёж.</li>
                <li>5. Нажмите кнопку «Отправить чек на WhatsApp».</li>
                <li>6. Укажите свой E-mail и прикрепите чек.</li>
                <li>7. В течение дня администратор активирует вашу подписку.</li>
            </ol>
        </div>
        </>
    );
}
