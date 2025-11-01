import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'Editar modelo entidad-relación' })
  title?: string;

  @ApiPropertyOptional({ example: 'user:ana' })
  @IsString() @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'in_progress', enum: ['pending', 'in_progress', 'completed'] })
  @IsIn(['pending', 'in_progress', 'completed'])
  status?: 'pending' | 'in_progress' | 'completed';

  // No permitimos cambiar orgCode/projectCode/taskNumber en este demo.
  orgCode?: never;
  projectCode?: never;
  taskNumber?: never;
}
