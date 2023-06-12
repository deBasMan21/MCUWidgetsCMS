import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActorEntity } from './actor.entity/actor.entity';
import { Repository } from 'typeorm';
import { ClickPageType } from '../tracking/click.entity/click.entity';

@Injectable()
export class ActorService {
    constructor(
        @InjectRepository(ActorEntity) 
        private actorRepository: Repository<ActorEntity>
    ) { }

    async getAll(): Promise<ActorEntity[]> {
        return await this.actorRepository.find({
            relations: {
                projects: true
            }
        });
    }

    async getById(id: number): Promise<ActorEntity> {
        return await this.actorRepository.findOne({
            where: [{ "id": id }]
        })
    }

    async update(actor: ActorEntity) {
        actor.pageType = ClickPageType.ACTOR
        this.actorRepository.save(actor);
    }

    async delete(actorId: number) {
        let actor = await this.getById(actorId);
        this.actorRepository.delete(actor);
    }
}