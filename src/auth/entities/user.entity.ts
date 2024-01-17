import { Tarea } from "src/tareas/entities/tarea.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string

    @Column('text')
    userName: string

    @Column('text', { select: false })
    password: string

    @OneToMany(
        () => Tarea,
        (tarea) => tarea.user
    )
    tarea: Tarea

    @BeforeInsert()
    checkFiledBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkBeforeUpdate() {
        this.checkFiledBeforeInsert();
    }


};
