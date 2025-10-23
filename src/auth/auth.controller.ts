import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStartDto } from './dto/login-start.dto';
import { ExchangeDto } from './dto/exchange.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  async startLogin(@Query() query: LoginStartDto) {
    const clientId = query.clientId;
    const returnTo = query.returnTo;

    const { url } = await this.authService.buildLoginUrl({ returnTo, clientId });
    return { url, statusCode: 302 };
  }

  @Post('exchange')
  async exchange(@Body() body: ExchangeDto, @Res() res: any) {
    if (!body?.code || !body?.state) {
      return res.status(400).json({ error: 'Faltan code/state' });
    }
    // 👇 Igual que antes, pero ahora llamando al microservicio
    const { sid, returnTo } = await this.authService.exchangeCode({
      code: body.code,
      state: body.state,
      sidCookie: body?.sidCookie,
    });
    console.log('Exchange OIDC - nueva sesión creada:', { sid, returnTo });
    // 👇 formato EXACTO esperado por tu frontend antiguo
    return res.status(200).json({ sessionId: sid, returnTo });
  }
}
