import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project/project.entity/project.entity';
import { DirectorController } from './director/director.controller';
import { DirectorService } from './director/director.service';
import { ActorService } from './actor/actor.service';
import { ActorController } from './actor/actor.controller';
import { DirectorEntity } from './director/director.entity/director.entity';
import { ActorEntity } from './actor/actor.entity/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ActorEntity, DirectorEntity])],
  providers: [RecommendationsService, ProjectService, DirectorService, ActorService],
  controllers: [RecommendationsController, ProjectController, DirectorController, ActorController],
})
export class RecommendationsModule {}
