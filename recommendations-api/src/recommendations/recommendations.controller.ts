import { BadRequestException, Controller, Get, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { ProjectEntity } from './project/project.entity/project.entity';
import { DirectorEntity } from './director/director.entity/director.entity';
import { ActorEntity } from './actor/actor.entity/actor.entity';
import { ApiHeader } from '@nestjs/swagger';

@Controller('recommendations')
export class RecommendationsController {
    constructor(private recommendationService: RecommendationsService) { }

    @ApiHeader({
        name: 'authentication',
        description: 'The authentication header should contain the userId',
        required: true,
    })
    @Get()
    async get(@Request() req): Promise<(ProjectEntity | DirectorEntity | ActorEntity)[]> {
        let userId: string | null = req.headers.authentication;
        if (userId == null) throw new BadRequestException("Missing userId in the authentication header");

        return await this.recommendationService.getRecommendations(userId);
    }
}
