import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/recommendations/project/project.entity/project.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class ActorEntity {
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
    @Column()
    character: string;

    @ApiProperty()
    @ManyToMany(() => ProjectEntity, (project) => project.actors)
    projects: ProjectEntity[];

}