import { ApiProperty } from '@nestjs/swagger';
import { ActorEntity } from 'src/recommendations/actor/actor.entity/actor.entity';
import { DirectorEntity, Identifiable } from 'src/recommendations/director/director.entity/director.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class ProjectEntity implements Identifiable  {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    releaseDate: Date
    
    @ApiProperty()
    @Column()
    overview: string;

    @ApiProperty()
    @Column()
    imdb_id: string;

    @ApiProperty()
    @Column()
    categories: string;

    @ApiProperty()
    @Column()
    posterUrl: string;

    @ApiProperty()
    @Column()
    type: ProjectType

    @ApiProperty()
    @ManyToMany(() => ActorEntity, (actor) => actor.projects)
    @JoinTable()
    actors: ActorEntity[];

    @ApiProperty()
    @ManyToMany(() => DirectorEntity, (director) => director.projects)
    @JoinTable()
    directors: DirectorEntity[]

    @ApiProperty()
    @ManyToMany(() => ProjectEntity)
    @JoinTable({
        name: "project_projects",
        joinColumn: {
            name: "project_entity",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "project_entity",
            referencedColumnName: "id"
        }
    })
    relatedProjects: ProjectEntity[]
}

export enum ProjectType {
    SERIE = "Serie",
    MOVIE = "Movie",
    SPECIAL = "Special",
    FOX = "Fox",
    MARVELTELEVISION = "MarvelTelevision",
    MARVELOTHER = "MarvelOther",
    SONY = "Sony",
    DEFENDERS = "Defenders"
}