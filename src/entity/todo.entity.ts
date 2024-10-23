import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UsersEntity } from "./users.entity";



export enum TodoStatusEnum{
not_Started="not_started",
in_progress= "in_progress",
completed="completed"
}
@Entity("todo")
export class TodoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UsersEntity, user => user.todos) // Assume UsersEntity has a todos relation
    @JoinColumn({ name: "user_id" })
    user: UsersEntity;

    @Column({name:"user_id"})
    userId: string;

    @Column({ name: "description" })
    description: string;

    @Column({ name: "date" })
    date: string;

    @Column({name:"status", type: "enum", enum: TodoStatusEnum, default: TodoStatusEnum.not_Started, nullable:true })
    status: TodoStatusEnum;

    @Column({ name: "start_time" })
    startTime: string;

    @Column({ name: "end_time" })
    endTime: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
