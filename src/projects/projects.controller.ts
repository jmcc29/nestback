// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  Res,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Resource, Scope } from 'src/auth/decorators';

@Resource('projects')
@ApiTags('projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Scope('list')
  @Get('projects')
  @ApiOperation({
    summary: 'Listar proyectos (opcional: filtrar por ?orgId=alpha)',
  })
  @ApiQuery({ name: 'orgId', required: false, example: 'alpha' })
  @ApiOkResponse({ description: 'Lista de proyectos' })
  findAll(@Query('orgId') orgId?: string) {
    return this.projectService.findAll(orgId);
  }

  @Scope('list')
  @Get('orgs/:orgId/projects')
  @ApiOperation({ summary: 'Listar proyectos de una organización' })
  @ApiParam({ name: 'orgId', example: 'alpha' })
  @ApiOkResponse({ description: 'Lista de proyectos por organización' })
  findByOrg(@Param('orgId') orgId: string) {
    return this.projectService.findAll(orgId);
  }

  @Scope('view-single')
  @Get('projects/:id')
  @ApiOperation({
    summary: 'Obtener un proyecto por id (ej: project:alpha:erp)',
  })
  @ApiParam({ name: 'id', example: 'project:alpha:erp' })
  @ApiOkResponse({ description: 'Proyecto encontrado' })
  @ApiNotFoundResponse({ description: 'Proyecto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOneById(id);
  }

  @Scope('create')
  @Post('projects')
  @ApiOperation({ summary: 'Crear un proyecto (id=project:{orgCode}:{code})' })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      erp: {
        summary: 'ERP en Alpha',
        value: {
          orgCode: 'alpha',
          code: 'erp',
          name: 'Sistema ERP Interno',
          description: 'Proyecto ERP demo',
        },
      },
      crm: {
        summary: 'CRM en Beta',
        value: {
          orgCode: 'beta',
          code: 'crm',
          name: 'CRM Corporativo',
          description: 'Proyecto CRM demo',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Proyecto creado' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Scope('update')
  @Patch('projects/:id')
  @ApiOperation({ summary: 'Actualizar nombre/description por id' })
  @ApiParam({ name: 'id', example: 'project:alpha:erp' })
  @ApiOkResponse({ description: 'Proyecto actualizado' })
  @ApiNotFoundResponse({ description: 'Proyecto no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Scope('delete')
  @Delete('projects/:id')
  @ApiOperation({ summary: 'Eliminar un proyecto por id' })
  @ApiParam({ name: 'id', example: 'project:alpha:erp' })
  @ApiOkResponse({ description: 'Proyecto eliminado' })
  @ApiNotFoundResponse({ description: 'Proyecto no encontrado' })
  remove(@Param('id') id: string) {
    this.projectService.remove(id);
    return { message: `Proyecto ${id} eliminado` };
  }
}
