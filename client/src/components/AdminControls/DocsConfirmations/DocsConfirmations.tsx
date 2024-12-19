import { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './DocsConfirmations.scss';
import { useGetNotPublishedDocsQuery, usePublishDocMutation, useRejectDocMutation } from '../../../store/api/document.api';
import { BsFiletypePdf } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export const DocsConfirmations = () => {
    const { t } = useTranslation();
    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL??"/api"}/uploads/`;
    const [docs, setDocs] = useState<{ id: number; image: string[]; lawyer: { id: string; name: string; surname: string } }[]>([]);
    const { data, refetch } = useGetNotPublishedDocsQuery('');
    const [publishDoc] = usePublishDocMutation();
    const [rejectDoc] = useRejectDocMutation();

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setDocs(data);
        }
    }, [data]); 


    const onApproveHandler = async (docId: number, lawyerId: number) => {
        await publishDoc({ docId, lawyerId });
        refetch();
    };

    const onRejectHandler = async (id: number) => {
        try {
            const reject = await rejectDoc({ id });
    
            if (!reject.error) {
                setDocs(prevDocs => prevDocs.filter(doc => doc.id !== id));
            } else {
                console.error("Ошибка при отклонении документа: ", reject.error);
            }
        } catch (error) {
            console.error("Ошибка при попытке отклонить документ: ", error);
        }
    };

    return (
        <div className="deal-history">
            {docs.length > 0 ? (
                docs.map((user, index) => (
                    <Card key={index} className="deal-history-card">
                        <CardContent className="deal-card-content">
                            <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                {t('Panel.docs.user')}: {user.lawyer.name + ' ' + user.lawyer.surname}
                            </Typography>
                            <Typography sx={{ fontSize: 18, color: 'green' }} className="deal-title">
                                {t('Panel.docs.photo')}:
                            </Typography>
                            <Typography style={{ display: 'flex', flexWrap: 'wrap' }} gap={5}>
                                {user.image.map((imgSrc: any, index: number) => (
                                    <div className="previewImg" key={index} title={imgSrc.name}>
                                        <a target="_blank" href={`${BASE_URL}${imgSrc.src}`} rel="noopener noreferrer">
                                            <BsFiletypePdf />
                                        </a>
                                        <a className="previewImg__name" target="_blank" href={`${BASE_URL}${imgSrc.src}`}/>
                                    </div>
                                ))}
                            </Typography>
                        </CardContent>
                        <CardActions className="deal-card-actions">
                            <Button
                                onClick={() => onApproveHandler(user.id, Number(user.lawyer.id))}
                                className="deal-button"
                                variant="contained"
                                size="small"
                                endIcon={<SendIcon />}
                            >
                                {t('Panel.docs.approve')}
                            </Button>
                            <Button
                                onClick={() => onRejectHandler(user.id)}
                                className="reject-button"
                                variant="contained"
                                size="small"
                                endIcon={<SendIcon />}
                            >
                                {t('Panel.docs.reject')}
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <div className="empty-show">
                    {t('Panel.docs.noUsers')}
                    <img src={`/static/empty-box.png`} alt="empty-box" />
                </div>
                
            )}
        </div>
    );
};
