export interface AiHistoryDto {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
