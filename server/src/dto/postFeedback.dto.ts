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
    @IsString({ message: 'Статус поста должен быть "Idea" | "Planned" | "Processing" | "Done"' })
    status!: "Idea" | "Planned" | "Processing" | "Done";

    @Expose()
    @IsNotEmpty({ message: 'Категория поста не должен быть пустым' })
    @IsString({ message: 'Категория поста должен быть "Functionality" | "Bag" | "UI" | "Performance"' })
    category!: "Functionality" | "Bag" | "UI" | "Performance";
}
