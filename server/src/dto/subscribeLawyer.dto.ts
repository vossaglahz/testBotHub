import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubscribeLawyerDto {
    @Expose()
    @IsNotEmpty({ message: 'ID Пользователя не должно быть пустой' })
    @IsNumber({}, { message: 'ID Пользователя должна быть числом' })
    id!: number;

    @Expose()
    @IsString({ message: 'Дата должна быть строкой' })
    dateSubscription?: string;
}
