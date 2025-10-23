import { IsNotEmpty, IsString } from 'class-validator';

export class LoginStartDto {
  @IsNotEmpty()
  @IsString()
  returnTo: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;
}
