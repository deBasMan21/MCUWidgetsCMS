import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity) 
        private projectRepository: Repository<ProjectEntity>
    ) { }

    async getAll(): Promise<ProjectEntity[]> {
        return await this.projectRepository.find();
    }

    async getById(id: number): Promise<ProjectEntity> {
        return await this.projectRepository.findOne({
            where: [{ "id": id }]
        })
    }

    async create(project: ProjectEntity) {
        this.projectRepository.create(project);
    }

    async update(project: ProjectEntity) {
        this.projectRepository.save(project);
    }

    async delete(projectId: number) {
        let project = await this.getById(projectId);
        this.projectRepository.delete(project);
    }
}
