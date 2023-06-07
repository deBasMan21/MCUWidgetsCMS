import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ProjectEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;
}
