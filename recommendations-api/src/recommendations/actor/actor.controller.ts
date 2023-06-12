import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ActorService } from './actor.service';
import { ActorEntity } from './actor.entity/actor.entity';

@ApiTags('Actor')
@Controller('actor')
export class ActorController {
        
    constructor(private actorService: ActorService) { }

    @Get()
    async getAll() {
        return await this.actorService.getAll();
    }

    @Get(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async getById(@Param() params) {
        return await this.actorService.getById(params.id);
    }

    @Post()
    async create(@Body() director: ActorEntity) {
        return await this.actorService.update(director);
    }

    @Put()
    async update(@Body() director: ActorEntity) {
        return await this.actorService.update(director);
    }

    @Delete(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async delete(@Param() params) {
        return await this.actorService.delete(params.id);
    }
}