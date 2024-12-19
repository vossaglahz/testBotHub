import './ChatMessageCard.scss';

interface Props {
    img?: string;
    message: string;
    role?: string;
}

export const ChatMessageCard: React.FC<Props> = ({ img, message, role }) => {
    return (
        <>
            {img && <img className="message-сard__img" src={img} alt="imageRobot" />}
            <div className={`message-сard__text message-сard ${role}`}>
                <p className="message-сard__message">{message}</p>
            </div>
        </>
    );
};
