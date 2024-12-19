import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { AiQuestionDto } from '@/dto/openAiQuestion.dto';
import Tesseract from 'tesseract.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
    async getMessageOpenAi(questionDto: AiQuestionDto) {
        try {
            const messages = [
                { role: 'system', content: questionDto.type },
                { role: 'user', content: questionDto.message },
            ];

            if (questionDto.document) {
                const jsonlFilePath = await this.convertPdfToJsonl(questionDto.document);
                const fileContent = await this.extractTextFromJsonl(jsonlFilePath);

                messages.push({
                    role: 'user',
                    content: `Содержимое загруженного файла: ${fileContent}`,
                });
            }

            if (questionDto.image) {
                if (typeof questionDto.image === 'object' && questionDto.image.src) {
                    const imagePath = questionDto.image.src;

                    try {
                        const text = await this.extractTextFromImage(imagePath);

                        messages.push({
                            role: 'user',
                            content: `Содержимое загруженного изображения: ${text}`,
                        });
                    } catch (err) {
                        console.error('Ошибка при извлечении текста из изображения:', err);
                        throw new Error('Не удалось обработать изображение');
                    }
                } else {
                    console.error('Неверный формат questionDto.image:', questionDto.image);
                    throw new Error('Изображение должно содержать путь в src');
                }
            } else {
                console.error('Изображение не предоставлено в запросе');
            }

            const completion = await openai.chat.completions.create({
                model: 'chatgpt-4o-latest',
                messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
            });
            const responseMessage = completion.choices[0].message.content;

            return { responseMessage };
        } catch (error: any) {
            console.error('Ошибка при выполнении запроса к OpenAI:', error);
            throw new Error('Ошибка сервера');
        }
    }

    async extractTextFromJsonl(filePath: string): Promise<string> {
        const data = fs.readFileSync(filePath, 'utf8');
        return data
            .split('\n')
            .map(line => JSON.parse(line).content)
            .join(' ');
    }

    async convertPdfToJsonl(document: { src: string; name: string }): Promise<string> {
        return new Promise((resolve, reject) => {
            const pdfBuffer = fs.readFileSync(document.src);
            pdf(pdfBuffer)
                .then(data => {
                    const jsonlData = data.text
                        .split('\n')
                        .map(line => JSON.stringify({ content: line }))
                        .join('\n');
                    const jsonlFilePath = path.join('./public/uploads', `${document.name}.jsonl`);
                    fs.writeFileSync(jsonlFilePath, jsonlData);
                    resolve(jsonlFilePath);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async extractTextFromImage(imagePath: string) {
        const tessdataPath = path.resolve(__dirname, '../tessdata');
        const {
            data: { text },
        } = await Tesseract.recognize(imagePath, 'eng+rus+kaz', {
            langPath: tessdataPath,
            cachePath: tessdataPath,
        });

        return text;
    }
}
