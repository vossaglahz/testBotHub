import { User } from '@/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

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

    @Column({ type: 'timestamp', nullable: true })
    createdAt!: Date;

    @BeforeInsert()
    setDealDate() {
        this.createdAt = new Date();
    }

    @Column()
    userId!: number;

    @Column('jsonb', { nullable: true })
    votes!: Partial<User>[];
}