import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExchangeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsString()
  @IsOptional()
  sidCookie?: string;
}
