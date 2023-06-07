import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project/project.entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [RecommendationsService, ProjectService],
  controllers: [RecommendationsController, ProjectController],
})
export class RecommendationsModule {}
