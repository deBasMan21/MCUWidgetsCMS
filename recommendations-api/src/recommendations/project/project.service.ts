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
        let oldVersion = await this.getById(project.id)

        project.overview = project.overview ?? oldVersion.overview ?? "No overview"
        project.categories = project.categories ?? oldVersion.categories ?? "No categories"
        project.imdb_id = project.imdb_id ?? oldVersion.imdb_id ?? "imdb id undefined"
        project.posterUrl = project.posterUrl ?? oldVersion.posterUrl ?? "https://mcuwidgets.buijsenserver.nl/uploads/mcu_Widgets_Logo_Dark_3de3442c2b_86a938dd99.png"
        project.releaseDate = project.releaseDate ?? oldVersion.releaseDate ?? new Date()

        project.pageType = ClickPageType.PROJECT

        this.projectRepository.save(project);
    }

    async delete(projectId: number) {
        let project = await this.getById(projectId);
        this.projectRepository.delete(project);
    }
}