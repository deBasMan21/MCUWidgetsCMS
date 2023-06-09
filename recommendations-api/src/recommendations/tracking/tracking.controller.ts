import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { ClickEntity } from './click.entity/click.entity';

@ApiTags('Director')
@Controller('tracking')
export class TrackingController {
    constructor(private trackingService: TrackingService) { }
    
    @Post()
    async create(@Body() click: ClickEntity) {
        return await this.trackingService.create(click);
    }
}
