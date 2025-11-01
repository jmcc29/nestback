import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'alpha', description: 'Código de la organización' })
  @IsString() @IsNotEmpty() @Length(2, 20)
  orgCode: string;

  @ApiProperty({ example: 'erp', description: 'Código del proyecto' })
  @IsString() @IsNotEmpty() @Length(2, 30)
  projectCode: string;

  @ApiProperty({ example: 42, description: 'Número correlativo de la tarea dentro del proyecto' })
  @IsInt() @Min(1)
  taskNumber: number;

  @ApiProperty({ example: 'Diseñar esquema de base de datos' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Modelo inicial y relaciones' })
  @IsString() @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'user:juan' })
  @IsString() @IsOptional()
  assignedTo?: string;

  @ApiProperty({ example: 'pending', enum: ['pending', 'in_progress', 'completed'] })
  @IsIn(['pending', 'in_progress', 'completed'])
  status: 'pending' | 'in_progress' | 'completed';
}
