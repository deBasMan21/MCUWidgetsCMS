import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/recommendations/project/project.entity/project.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class DirectorEntity implements Identifiable {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Column()
    firstName: string;

    @ApiProperty()
    @Column()
    lastName: string;

    @ApiProperty()
    @Column()
    dateOfBirth: Date;

    @ApiProperty()
    @Column()
    imageUrl: string;

    @ApiProperty()
    @ManyToMany(() => ProjectEntity, (project) => project.directors)
    projects: ProjectEntity[]
}


export interface Identifiable {
    id: number;
}