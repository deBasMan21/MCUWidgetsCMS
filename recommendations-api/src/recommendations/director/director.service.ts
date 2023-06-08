import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectorEntity } from './director.entity/director.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DirectorService {
    constructor(
        @InjectRepository(DirectorEntity) 
        private directorRepository: Repository<DirectorEntity>
    ) { }

    async getAll(): Promise<DirectorEntity[]> {
        return await this.directorRepository.find({
            relations: {
                projects: true
            }
        });
    }

    async getById(id: number): Promise<DirectorEntity> {
        return await this.directorRepository.findOne({
            where: [{ "id": id }]
        })
    }

    async update(director: DirectorEntity) {
        this.directorRepository.save(director);
    }

    async delete(directorId: number) {
        let director = await this.getById(directorId);
        this.directorRepository.delete(director);
    }
}
