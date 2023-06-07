import { Body, Controller, Delete, Get, Injectable, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity/project.entity';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { get } from 'http';

@Controller('project')
export class ProjectController {
    
    constructor(private projectService: ProjectService) { }

    @Get()
    getAll() {
        return this.projectService.getAll();
    }

    @Get(':id')
    getById(@Param() params) {
        return this.projectService.getById(params.id);
    }

    @Post()
    create(@Body() project: ProjectEntity) {
        return this.projectService.create(project);
    }

    @Put()
    update(@Body() project: ProjectEntity) {
        return this.projectService.update(project);
    }

    @Delete(':id')
    delete(@Param() params) {
        return this.projectService.delete(params.id);
    }
}
