import { Module } from '@nestjs/common';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './recommendations/project/project.entity/project.entity';

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
      entities: [ProjectEntity],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
