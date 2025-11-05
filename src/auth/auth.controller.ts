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
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  async startLogin(@Query() query: LoginStartDto) {
    const clientId = query.clientId;
    const returnTo = query.returnTo;

    const { url } = await this.authService.buildLoginUrl({
      returnTo,
      clientId,
    });
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
    return res.status(200).json({ sessionId: sid, returnTo });
  }

  @Delete('logout')
  @ApiQuery({
    name: 'sid',
    required: false,
    description: 'ID de sesión (si no, cookie "sid")',
  })
  async logout(@Req() req: Request, @Query('sid') sidFromQuery?: string) {
    const sid = sidFromQuery ?? req.cookies?.sid;
    if (!sid) {
      throw new Error('No se proporcionó sid para logout');
    }
    await this.authService.logout(sid);
    return { ok: true };
  }

  @Get('profile')
  @ApiQuery({
    name: 'sid',
    required: false,
    description: 'ID de sesión (si no, cookie "sid")',
  })
  async profile(@Req() req: Request, @Query('sid') sidFromQuery?: string) {
    const sid = sidFromQuery ?? req.cookies?.sid;
    if (!sid) {
      throw new Error('No se proporcionó sid para profile');
    }
    const profile = await this.authService.getProfile(sid);
    return profile;
  }

  @Get('permissions')
  @ApiQuery({
    name: 'sid',
    required: false,
    description: 'ID de sesión (si no, cookie "sid")',
  })
  async permissions(
    @Req() req: Request,
    @Query('sid') sidFromQuery?: string,
    @Query('clientId') clientId?: string,
    @Query('audience') audience?: string,
  ) {
    const sid = sidFromQuery ?? req.cookies?.sid;
    if (!sid) {
      throw new Error('No se proporcionó sid para permissions');
    }
    if (!clientId) {
      throw new Error('No se proporcionó client_id para permissions');
    }
    if (!audience) {
      throw new Error('No se proporcionó audience para permissions');
    }
    const permissions = await this.authService.getPermissions(sid, clientId, audience);
    return permissions;
  }

  @Get('evaluate-permission')
  @ApiQuery({
    name: 'sid',
    required: false,
    description: 'ID de sesión (si no, cookie "sid")',
  })
  async evaluatePermission(
    @Req() req: Request,
    @Query('sid') sidFromQuery?: string,
    @Query('clientId') clientId?: string,
    @Query('audience') audience?: string,
    @Query('permission') permission?: string,
  ) {
    const sid = sidFromQuery ?? req.cookies?.sid;
    if (!sid) {
      throw new Error('No se proporcionó sid para permissions');
    }
    if (!clientId) {
      throw new Error('No se proporcionó client_id para permissions');
    }
    if (!audience) {
      throw new Error('No se proporcionó audience para permissions');
    }
    if (!permission) {
      throw new Error('No se proporcionó permission para permissions');
    }
    const result = await this.authService.evaluatePermission(sid, clientId, audience, permission);
    return result;
  }
}
