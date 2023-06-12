import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DirectorService } from './director.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DirectorEntity } from './director.entity/director.entity';

@ApiTags('Director')
@Controller('director')
export class DirectorController {
        
    constructor(private directorService: DirectorService) { }

    @Get()
    async getAll() {
        return await this.directorService.getAll();
    }

    @Get(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async getById(@Param() params) {
        return await this.directorService.getById(params.id);
    }

    @Post()
    async create(@Body() director: DirectorEntity) {
        return await this.directorService.update(director);
    }

    @Put()
    async update(@Body() director: DirectorEntity) {
        return await this.directorService.update(director);
    }

    @Delete(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async delete(@Param() params) {
        return await this.directorService.delete(params.id);
    }
}
