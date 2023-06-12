import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClickEntity, ClickPageType } from './click.entity/click.entity';
import { DirectorEntity } from '../director/director.entity/director.entity';
import { ActorEntity } from '../actor/actor.entity/actor.entity';
import { ProjectEntity } from '../project/project.entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(ClickEntity) 
        private clickRepository: Repository<ClickEntity>,

        @InjectRepository(DirectorEntity) 
        private directorRepository: Repository<DirectorEntity>,

        @InjectRepository(ActorEntity) 
        private actorRepository: Repository<ActorEntity>,
        
        @InjectRepository(ProjectEntity) 
        private projectRepository: Repository<ProjectEntity>
    ) { }

    async create(click: ClickEntity) {
        switch (click.pageType) {
            case ClickPageType.ACTOR:
                let actor = await this.actorRepository.findOne({ where: { id: click.pageId }})
                click.actor = actor;
                break;
            case ClickPageType.DIRECTOR:
                let director = await this.directorRepository.findOne({ where: { id: click.pageId }})
                click.director = director;
                break;
            case ClickPageType.PROJECT:
                let project = await this.projectRepository.findOne({ where: { id: click.pageId }})
                click.project = project;
                break;
        }

        console.log(click)

        this.clickRepository.save(click);
    }

    async getAll(): Promise<ClickEntity[]> {
        return this.clickRepository.find({
            relations: {
                actor: {
                    projects: true
                },
                director: {
                    projects: true
                },
                project: {
                    relatedProjects: true,
                    actors: true,
                    directors: true
                }
            }
        });
    }
}
