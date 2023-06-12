import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity/project.entity';
import { Entity, Repository } from 'typeorm';
import { ClickPageType } from '../tracking/click.entity/click.entity';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity) 
        private projectRepository: Repository<ProjectEntity>
    ) { }

    async getAll(): Promise<ProjectEntity[]> {
        return await this.projectRepository.find({
            relations: {
                actors: true,
                directors: true,
                relatedProjects: true
            }
        });
    }

    async getById(id: number): Promise<ProjectEntity> {
        return await this.projectRepository.findOne({
            where: [{ "id": id }]
        })
    }

    async update(project: ProjectEntity) {
        project.pageType = ClickPageType.PROJECT
        this.projectRepository.save(project);
    }

    async delete(projectId: number) {
        let project = await this.getById(projectId);
        this.projectRepository.delete(project);
    }
}