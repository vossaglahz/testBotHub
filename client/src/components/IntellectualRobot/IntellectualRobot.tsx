import { useEffect, useRef, useState } from 'react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import './IntellectualRobot.scss';
import { Container } from '@mui/material';
import { BsTrash3 } from 'react-icons/bs';
import { ChatMessageCard } from './MessageCard/ChatMessageCard';
import { useMessageOpenAiMutation, useSpeechToTextMutation } from '../../store/api/openAI.api';
import { PiPauseCircle } from 'react-icons/pi';
import { AiOutlineAudio } from 'react-icons/ai';
import { AlertComponent } from '../UI/Alert/Alert';
import { GiSoundWaves } from 'react-icons/gi';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { LuFileText } from 'react-icons/lu';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface Message {
    content: string;
    role: string;
}

export const IntellectualRobot = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<Message>({ content: '', role: '' });
    const [doc, setDoc] = useState<File | null>(null);
    const [messageType, setMessageType] = useState<string | null>(null);
    const [typeValue, setTypeValue] = useState(false);

    const [messages, setMessages] = useState<Message[] | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messageOpenAi, { isLoading }] = useMessageOpenAiMutation();
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [speechToText, { isLoading: isSpeechToTextLoading }] = useSpeechToTextMutation();
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [isClickedTheme, setIsClickedTheme] = useState<boolean>(false);

    const inputRefDoc = useRef<HTMLInputElement>(null);
    const onFileChangeDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDoc(file);
        }
    };

    const onDeleteDoc = () => {
        setDoc(null);
        if (inputRefDoc.current) {
            inputRefDoc.current.value = '';
        }
    };

    useEffect(() => {
        if (messageType) setTypeValue(true);
        if (!messageType) setTypeValue(false);
    }, [messageType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.content.trim()) return;

        setMessages(messages ? [...messages, message] : [message]);

        const formData = new FormData();
        if (doc) {
            formData.append('document', doc);
        }

        console.log('doc: ', doc);

        formData.append('message', message.content);
        formData.append('role', message.role);

        if (messageType) {
            formData.append('type', messageType);
        }

        try {
            const messageData = await messageOpenAi(formData);

            if (messageData) {
                const systemMessage: Message = { content: messageData.data.responseMessage, role: 'system' };
                setMessages(prevMessages => [...(prevMessages || []), systemMessage]);
            }

            setMessage({ content: '', role: '' });
            setDoc(null);

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch (error) {
            console.error(t('Robot.sendError'), error);
        }
    };

    const cleanHandleSubmit = () => {
        setMessages(null);
        setMessage({ content: '', role: '' });
        setMessageType(null);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const onPlayHandler = async () => {
        if (!messageType) {
            setIsClickedTheme(true);
            setTimeout(() => setIsClickedTheme(false), 1000);
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Ваш браузер не поддерживает запись аудио.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioURL(URL.createObjectURL(audioBlob));

                mediaRecorder.stream.getTracks().forEach(track => track.stop());

                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.webm');

                try {
                    const response = await speechToText(formData);
                    if (response.error) {
                        throw new Error('Ошибка при отправке файла');
                    }

                    const transcription = response.data.transcription;

                    setMessage(prevMessage => ({
                        content: prevMessage.content + ' ' + transcription,
                        role: 'user',
                    }));
                } catch (error) {
                    console.error('Ошибка при отправке аудиофайла:', error);
                }

                audioChunksRef.current = [];
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Ошибка при доступе к микрофону:', error);
            alert('Не удалось получить доступ к микрофону.');
        }
    };

    const onPauseHandler = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        setMessage({ content: target.value, role: 'user' });

        if (textareaRef.current) {
            textareaRef.current.style.height = `${Math.min(target.scrollHeight, 150)}px`;
        }
    };

    return (
        <>
            <AlertComponent isError={isClickedTheme} text={'Сначало выберите тему запроса'} status={'error'} />
            <Container>
                <div className="chat-wrapper">
                    <div className="messages">
                        {!messages && (
                            <div className="message-сard">
                                <ChatMessageCard img={`/static/robot-mini.svg`} message={t('Robot.howToHelp')} />
                            </div>
                        )}
                        {messages &&
                            messages.map((message, index) => (
                                <div
                                    className="message-сard"
                                    key={index}
                                    style={{ justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}
                                >
                                    {message.role === 'user' ? (
                                        <ChatMessageCard message={message.content} role="user" />
                                    ) : (
                                        <ChatMessageCard img="/static/robot-mini.svg" message={message.content} role="chatgpt" />
                                    )}
                                </div>
                            ))}
                        {isLoading ? (
                            <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="robot-chat-form" onSubmit={handleSubmit}>
                        <div className="services-types">
                            <button
                                className={`services-type-item ${messageType === t('Robot.family') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.family') ? null : t('Robot.family'))}
                            >
                                {t('Robot.family')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.medical') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.medical') ? null : t('Robot.medical'))}
                            >
                                {t('Robot.medical')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.educate') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.educate') ? null : t('Robot.educate'))}
                            >
                                {t('Robot.educate')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.employment') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.employment') ? null : t('Robot.employment'))}
                            >
                                {t('Robot.employment')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.social') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.social') ? null : t('Robot.social'))}
                            >
                                {t('Robot.social')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.migration') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.migration') ? null : t('Robot.migration'))}
                            >
                                {t('Robot.migration')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.estate') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.estate') ? null : t('Robot.estate'))}
                            >
                                {t('Robot.estate')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.custom') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.custom') ? null : t('Robot.custom'))}
                            >
                                {t('Robot.custom')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.lawHelp') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.lawHelp') ? null : t('Robot.lawHelp'))}
                            >
                                {t('Robot.lawHelp')}
                            </button>
                            <button
                                className={`services-type-item ${messageType === t('Robot.transport') ? 'selected' : ''}`}
                                onClick={() => setMessageType(messageType === t('Robot.transport') ? null : t('Robot.transport'))}
                            >
                                {t('Robot.transport')}
                            </button>
                        </div>
                        <div className="input-block">
                            <div className="input-wrap">
                                <div className="input-wrap-inner">
                                    {doc ? (
                                        <div className="preview">
                                            <button onClick={onDeleteDoc} className="close">
                                                <IoIosCloseCircleOutline size={25} />
                                            </button>
                                            <LuFileText size={30} color="#4C75A3" />
                                            <p>{doc?.name}</p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    {isSpeechToTextLoading ? (
                                        <p style={{ width: '100%', color: 'black', margin: '20px' }}>Ваш голос обрабатывается...</p>
                                    ) : (
                                        <textarea
                                            disabled={!typeValue}
                                            ref={textareaRef}
                                            value={message.content}
                                            className="textAI"
                                            onChange={handleTextareaChange}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmit(e);
                                                }
                                            }}
                                            placeholder={t('Robot.questType')}
                                            rows={1}
                                        />
                                    )}
                                    <div className="content">
                                        <div className="docBg">
                                            <input
                                                ref={inputRefDoc}
                                                type="file"
                                                onChange={onFileChangeDocument}
                                                name="documents"
                                                style={{ display: 'none' }}
                                                accept=".png, .jpg, .jpeg, .pdf, .webp"
                                            />
                                            <button type="button" onClick={() => inputRefDoc.current?.click()} className="docBtn">
                                                <HiOutlineDocumentDownload size={45} color="#4C75A3" />
                                            </button>
                                        </div>
                                        {isRecording ? (
                                            <p
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginLeft: 20,
                                                    color: 'black',
                                                    width: '100%',
                                                }}
                                            >
                                                <AiOutlineAudio size={40} color="red" />
                                                Записывается аудио...
                                            </p>
                                        ) : (
                                            <div style={{ width: '100%' }}></div>
                                        )}
                                        {isRecording ? (
                                            <button type="button" onClick={onPauseHandler} className="chat-form__button">
                                                <PiPauseCircle size={45} color="red" />
                                            </button>
                                        ) : (
                                            <button type="button" onClick={onPlayHandler} className="chat-form__button">
                                                <GiSoundWaves color="#4C75A3" size={45} />
                                            </button>
                                        )}
                                        {audioURL && <audio style={{ display: 'none' }} controls src={audioURL}></audio>}
                                        <button className="chat-form__button" type="submit" disabled={isLoading}>
                                            <IoArrowUpCircleOutline size={45} color="#4C75A3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="chat-clean__button" type="submit">
                                <BsTrash3 size={35} color="#4C75A3" onClick={cleanHandleSubmit} />
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    );
};
