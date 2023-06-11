import { ApiProperty } from '@nestjs/swagger';
import { Identifiable } from 'src/recommendations/director/director.entity/director.entity';
import { ProjectEntity } from 'src/recommendations/project/project.entity/project.entity';
import { ClickPageType } from 'src/recommendations/tracking/click.entity/click.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class ActorEntity implements Identifiable  {
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
    
    @Column()
    pageType: ClickPageType

    @ApiProperty()
    @ManyToMany(() => ProjectEntity, (project) => project.actors)
    projects: ProjectEntity[];
}