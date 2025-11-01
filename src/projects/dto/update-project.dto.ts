import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ example: 'Nuevo nombre (opcional en PATCH)' })
  name?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción (opcional en PATCH)' })
  description?: string;

  // No permitimos cambiar orgCode/code en este demo (mantiene id estable)
  orgCode?: never;
  code?: never;
}
