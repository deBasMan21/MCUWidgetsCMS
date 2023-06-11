import { ApiProperty } from '@nestjs/swagger';
import { ActorEntity } from 'src/recommendations/actor/actor.entity/actor.entity';
import { DirectorEntity } from 'src/recommendations/director/director.entity/director.entity';
import { ProjectEntity } from 'src/recommendations/project/project.entity/project.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClickEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    pageType: ClickPageType;

    @ApiProperty()
    @Column()
    pageId: number;

    @Column()
    userId: string;

    @CreateDateColumn()
    timeStamp: Date;

    @ManyToOne(() => ProjectEntity, () => ClickEntity, { nullable: true })
    project: ProjectEntity;

    @ManyToOne(() => DirectorEntity, () => ClickEntity, { nullable: true })
    director: DirectorEntity;

    @ManyToOne(() => ActorEntity, () => ClickEntity, { nullable: true })
    actor: ActorEntity;
}

export enum ClickPageType {
    PROJECT = "PROJECT",
    ACTOR = "ACTOR",
    DIRECTOR = "DIRECTOR"
}