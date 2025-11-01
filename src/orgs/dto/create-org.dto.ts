import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrgDto {
  @ApiProperty({
    example: 'alpha',
    description: 'Código corto de la organización (se usará para construir id=org:{code})',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  code: string;

  @ApiProperty({ example: 'Organización Alpha' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Organización de prueba con varios proyectos.' })
  @IsString()
  description: string;
}
