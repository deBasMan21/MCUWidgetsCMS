import { Body, Controller, Delete, Get, Injectable, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity/project.entity';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { get } from 'http';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ActorEntity } from '../actor/actor.entity/actor.entity';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
    
    constructor(private projectService: ProjectService) { }

    @Get()
    async getAll() {
        return await this.projectService.getAll();
    }

    @Get(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async getById(@Param() params) {
        return await this.projectService.getById(params.id);
    }

    @Post()
    async create(@Body() project: ProjectEntity) {
        return await this.projectService.update(project);
    }

    @Put()
    async update(@Body() project: ProjectEntity) {
        return await this.projectService.update(project);
    }

    @Delete(':id')
    @ApiParam({name: 'id', required: true, schema: { type: 'integer' }})
    async delete(@Param() params) {
        return await this.projectService.delete(params.id);
    }
}
