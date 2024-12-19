import { useTranslation } from "react-i18next"
import "./MessageCard.scss"

interface IProps {
    image?:string
    fullName?: string
    message:string
    date:string
}

export const MessageCard = (props:IProps) => {
    const { t } = useTranslation();
    
    return (
        <div className="messageCard"   style={{
                flexDirection: props.fullName !== t('Chat.you') ? "row-reverse" : "row"
            }}>
            <div className="messageCard__text">
                <h4 className="messageCard__name">{props.fullName}</h4>
                <span className="messageCard__time">{props.date}</span>
                <p className="messageCard__message">{props.message}</p>
            </div>
            <img className="messageCard__img" src={props.image?props.image:`/static/no-image.png`} alt="imageUsers" />
        </div>
    )
}
