import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgDto } from './create-org.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrgDto extends PartialType(CreateOrgDto) {
  @ApiPropertyOptional({ example: 'Nuevo nombre (opcional en PATCH)' })
  name?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción (opcional en PATCH)' })
  description?: string;
}
