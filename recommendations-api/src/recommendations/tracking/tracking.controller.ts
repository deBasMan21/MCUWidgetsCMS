import { BadRequestException, Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { ClickEntity } from './click.entity/click.entity';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
    constructor(private trackingService: TrackingService) { }

    @ApiHeader({
        name: 'authentication',
        description: 'The authentication header should contain the userId',
        required: true,
    })
    @Post()
    async create(@Request() req, @Body() click: ClickEntity) {
        let userId: string | null = req.headers.authentication
        if (userId == null) throw new BadRequestException("Missing userId in the authentication header");

        click.userId = userId;
        return await this.trackingService.create(click);
    }

    @Get()
    async get(): Promise<ClickEntity[]> {
        return await this.trackingService.getAll();
    }
}
