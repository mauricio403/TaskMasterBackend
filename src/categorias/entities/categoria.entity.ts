import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Categoria {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    categoryName: string
}
