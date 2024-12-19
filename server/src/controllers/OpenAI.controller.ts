import { AiQuestionDto } from '@/dto/openAiQuestion.dto';
import { formatErrors } from '@/helpers/formatErrors';
import { OpenAIService } from '@/services/OpenAI.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIController {
    private service: OpenAIService;

    constructor() {
        this.service = new OpenAIService();
    }

    getMessageOpenAi: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const questionDto = plainToInstance(AiQuestionDto, {
                message: req.body.message,
                role: req.body.role,
                type: req.body.type,
                document: undefined,
                image: undefined,
            });

            if (req.file) {
                const fileType = req.file.mimetype;
                if (fileType === 'application/pdf') {
                    questionDto.document = {
                        src: req.file.path,
                        name: req.file.originalname,
                    };
                } else if (fileType.startsWith('image/')) {
                    questionDto.image = {
                        src: req.file.path,
                        name: req.file.originalname,
                    };
                }
            }

            const validationErrors = await validate(questionDto);

            if (validationErrors.length > 0) {
                res.status(400).json({ errors: formatErrors(validationErrors) });
                return;
            }

            const msgOpenAi = await this.service.getMessageOpenAi(questionDto);
            res.status(200).send(msgOpenAi);
        } catch (error) {
            next(error);
        }
    };

    speechToText: RequestHandler[] = [
        async (req, res, next): Promise<void> => {
            let audioFilePath: string | undefined;

            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No audio file uploaded.' });
                    return;
                }

                audioFilePath = path.resolve(req.file.path);

                if (!fs.existsSync(audioFilePath)) {
                    res.status(404).json({ message: 'File not found.' });
                    return;
                }

                const audioStream = fs.createReadStream(audioFilePath);
                const response = await openai.audio.transcriptions.create({
                    file: audioStream,
                    model: 'whisper-1',
                });

                res.status(200).json({ transcription: response.text });
            } catch (error) {
                next(error);
            }
        },
    ];
}
