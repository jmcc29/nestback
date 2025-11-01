import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrgsService } from './orgs.service';
// DTOs
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
// Swagger
import {
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('orgs')
@Controller('orgs')
export class OrgsController {
  constructor(private readonly OrgsService: OrgsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar organizaciones' })
  @ApiOkResponse({
    description: 'Lista de organizaciones devuelta exitosamente',
  })
  findAll() {
    return this.OrgsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una organización por id (ej: org:alpha)' })
  @ApiParam({ name: 'id', example: 'org:alpha' })
  @ApiOkResponse({ description: 'Organización encontrada' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  findOne(@Param('id') id: string) {
    return this.OrgsService.findOneById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una organización (id se genera como org:{code})',
  })
  @ApiBody({
    type: CreateOrgDto,
    examples: {
      alpha: {
        summary: 'Ejemplo Alpha',
        value: {
          code: 'alpha',
          name: 'Organización Alpha',
          description: 'Org demo Alpha',
        },
      },
      beta: {
        summary: 'Ejemplo Beta',
        value: {
          code: 'beta',
          name: 'Organización Beta',
          description: 'Org demo Beta',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Organización creada' })
  create(@Body() dto: CreateOrgDto) {
    return this.OrgsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nombre/description por id' })
  @ApiParam({ name: 'id', example: 'org:alpha' })
  @ApiBody({
    type: UpdateOrgDto,
    examples: {
      cambioNombre: {
        summary: 'Cambiar nombre',
        value: { name: 'Organización Alpha (Actualizada)' },
      },
      cambioDescripcion: {
        summary: 'Cambiar descripción',
        value: { description: 'Descripción actualizada' },
      },
    },
  })
  @ApiOkResponse({ description: 'Organización actualizada' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateOrgDto) {
    return this.OrgsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una organización por id' })
  @ApiParam({ name: 'id', example: 'org:alpha' })
  @ApiOkResponse({ description: 'Organización eliminada' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  remove(@Param('id') id: string) {
    this.OrgsService.remove(id);
    return { message: `Organización ${id} eliminada` };
  }
}
