import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class Tarea {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    title: string

    @Column('text')
    description: string

    @Column('date')
    expiration_date: Date

    @Column('text')
    priority: string

    @Column('text')
    estado: string

    @ManyToOne(
        () => User,
        (user) => user.tarea,
        { eager: true }
    )
    user: User
};
