import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    categoryName: string
}
