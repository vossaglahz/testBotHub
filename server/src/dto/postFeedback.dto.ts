import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';

enum Category {
  Functionality = 'Functionality',
  Bug = 'Bug',
  UI = 'UI',
  Performance = 'Performance',
}

enum Status {
  Idea = 'Idea',
  Planned = 'Planned',
  Processing = 'Processing',
  Done = 'Done',
}

export class PostFeedbackDto {
  @Expose()
  @IsNotEmpty({ message: 'Наименование поста не должно быть пустым' })
  title!: string;

  @Expose()
  @IsNotEmpty({ message: 'Описание поста не должно быть пустым' })
  description!: string;

  @Expose()
  @IsNotEmpty({ message: 'Статус поста не должна быть пустой' })
  @IsEnum(Status, { message: 'Статус поста должен быть "Idea" | "Planned" | "Processing" | "Done"' })
  status!: Status;

  @Expose()
  @IsNotEmpty({ message: 'Категория поста не должна быть пустым' })
  @IsEnum(Category, { message: 'Категория поста должна быть "Functionality" | "Bug" | "UI" | "Performance"' })
  category!: Category;
}
