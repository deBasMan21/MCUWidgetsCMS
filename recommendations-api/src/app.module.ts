import { Module } from '@nestjs/common';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './recommendations/project/project.entity/project.entity';
import { DirectorEntity } from './recommendations/director/director.entity/director.entity';
import { ActorEntity } from './recommendations/actor/actor.entity/actor.entity';
import { ClickEntity } from './recommendations/tracking/click.entity/click.entity';

@Module({
  imports: [
    RecommendationsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mcu-widgets-recommendations-db',
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: 'MCUWidgetsRecommendationsDB',
      entities: [ProjectEntity, ActorEntity, DirectorEntity, ClickEntity],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
