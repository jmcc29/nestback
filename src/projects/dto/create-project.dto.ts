import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'alpha', description: 'Código de la organización a la que pertenece' })
  @IsString() @IsNotEmpty() @Length(2, 20)
  orgCode: string;

  @ApiProperty({ example: 'erp', description: 'Código corto del proyecto; formará id=project:{orgCode}:{code}' })
  @IsString() @IsNotEmpty() @Length(2, 30)
  code: string;

  @ApiProperty({ example: 'Sistema ERP Interno' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Proyecto para integrar módulos administrativos.' })
  @IsString()
  description: string;
}
