import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostFeedbackDto {
    @Expose()
    @IsNotEmpty({ message: 'Наименование поста не должно быть пустым' })
    title!: string;

    @Expose()
    @IsNotEmpty({ message: 'Описание поста не должно быть пустым' })
    description!: string;

    @Expose()
    @IsNotEmpty({ message: 'Статус поста не должна быть пустой' })
    @IsString({ message: 'Статус поста должен быть строкой' })
    status!: number;

    @Expose()
    @IsNotEmpty({ message: 'Тип поста не должен быть пустым' })
    @IsString({ message: 'Тип поста должен быть строкой' })
    category!: string;
}
