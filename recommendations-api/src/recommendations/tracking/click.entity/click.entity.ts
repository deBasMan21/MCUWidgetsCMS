import { ApiProperty } from '@nestjs/swagger';
import { ActorEntity } from 'src/recommendations/actor/actor.entity/actor.entity';
import { DirectorEntity } from 'src/recommendations/director/director.entity/director.entity';
import { ProjectEntity } from 'src/recommendations/project/project.entity/project.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class ClickEntity {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Column()
    pageType: ClickPageType;

    @ApiProperty()
    @Column()
    pageId: number;

    @CreateDateColumn()
    timeStamp: Date;

    @Column({ nullable: true })
    @ManyToOne(() => ProjectEntity, () => ClickEntity, { nullable: true })
    project: ProjectEntity;

    @Column({ nullable: true })
    @ManyToOne(() => DirectorEntity, () => ClickEntity, { nullable: true })
    director: DirectorEntity;

    @Column({ nullable: true })
    @ManyToOne(() => ActorEntity, () => ClickEntity, { nullable: true })
    actor: ActorEntity;
}

export enum ClickPageType {
    PROJECT = "PROJECT",
    ACTOR = "ACTOR",
    DIRECTOR = "DIRECTOR"
}