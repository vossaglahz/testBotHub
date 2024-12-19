import { User } from '@/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    category!: string;
    
    @Column({ default: 'Idea' })
    status!: "Idea" | "Planned" | "Processing" | "Done";

    private _createdAt!: Date;
    @CreateDateColumn({ type: 'timestamp' })
    get createdAt(): string {
        const date = new Date(this._createdAt);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column('jsonb', { nullable: true })
    votes!: Partial<User>[];
}