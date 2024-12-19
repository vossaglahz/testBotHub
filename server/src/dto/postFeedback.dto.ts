import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostFeedbackDto {
    @Expose()
    @IsNotEmpty({ message: 'Наименование поста не должно быть пустым' })
    title!: string;

    @Expose()
    @IsNotEmpty({ message: 'Описание поста не должно быть пустым' })
    description!: string;

    @Expose()
    @IsNotEmpty({ message: 'Цена вопроса не должна быть пустой' })
    @IsNumber({}, { message: 'Цена вопроса должна быть числом' })
    price!: number;

    @Expose()
    @IsNotEmpty({ message: 'Тип поста не должен быть пустым' })
    @IsString({ message: 'Тип поста должен быть строкой' })
    status!: string;
}
