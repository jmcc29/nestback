// src/tasks/tasks.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Resource, Scope } from 'src/auth/decorators';


@Resource('tasks')
@ApiTags('tasks')
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Scope('list')
  @Get('tasks')
  @ApiOperation({
    summary: 'Listar tareas (opcional: ?orgId=alpha&projectId=erp)',
  })
  @ApiQuery({ name: 'orgId', required: false, example: 'alpha' })
  @ApiQuery({ name: 'projectId', required: false, example: 'erp' })
  @ApiOkResponse({ description: 'Lista de tareas' })
  findAll(
    @Query('orgId') orgId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.tasksService.findAll({ orgCode: orgId, projectCode: projectId });
  }

  @Scope('list')
  @Get('orgs/:orgId/projects/:projectId/tasks')
  @ApiOperation({ summary: 'Listar tareas de un proyecto' })
  @ApiParam({ name: 'orgId', example: 'alpha' })
  @ApiParam({ name: 'projectId', example: 'erp' })
  @ApiOkResponse({ description: 'Lista de tareas por proyecto' })
  findByProject(
    @Param('orgId') orgId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAll({ orgCode: orgId, projectCode: projectId });
  }

  @Scope('view-single')
  @Get('tasks/:id')
  @ApiOperation({ summary: 'Obtener tarea por id (ej: task:alpha:erp:42)' })
  @ApiParam({ name: 'id', example: 'task:alpha:erp:42' })
  @ApiOkResponse({ description: 'Tarea encontrada' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOneById(id);
  }

  @Scope('create')
  @Post('tasks')
  @ApiOperation({
    summary: 'Crear tarea (id=task:{orgCode}:{projectCode}:{taskNumber})',
  })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      alphaErp42: {
        summary: 'ERP/Alpha #42',
        value: {
          orgCode: 'alpha',
          projectCode: 'erp',
          taskNumber: 99,
          title: 'Analizar requerimientos',
          description: 'Revisión con stakeholders',
          assignedTo: 'user:ana',
          status: 'pending',
        },
      },
      betaCrm3: {
        summary: 'CRM/Beta #3',
        value: {
          orgCode: 'beta',
          projectCode: 'crm',
          taskNumber: 7,
          title: 'Configurar pipeline CI/CD',
          assignedTo: 'user:maria',
          status: 'in_progress',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Tarea creada' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Scope('update')
  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Actualizar tarea por id' })
  @ApiParam({ name: 'id', example: 'task:alpha:erp:42' })
  @ApiOkResponse({ description: 'Tarea actualizada' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Scope('delete')
  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Eliminar tarea por id' })
  @ApiParam({ name: 'id', example: 'task:alpha:erp:42' })
  @ApiOkResponse({ description: 'Tarea eliminada' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  remove(@Param('id') id: string) {
    this.tasksService.remove(id);
    return { message: `Tarea ${id} eliminada` };
  }
}
