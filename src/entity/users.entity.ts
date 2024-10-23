// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TodoEntity } from './todo.entity';


@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name:"first_name", nullable: true })
    firstName: string;

    @Column({name:"last_name", nullable: true })
    lastName: string;

    @Column({unique:true, nullable: true })
    email: string;

    @Column({name:"password", nullable: true })
    password: string;

    @Column({name:"phone_number" ,nullable: true })
    phoneNumber: string;

    @Column({ default: false })
    isDeleted: boolean;  

    @OneToMany(() => TodoEntity, (todo)=> todo.userId) 
    todos: TodoEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
