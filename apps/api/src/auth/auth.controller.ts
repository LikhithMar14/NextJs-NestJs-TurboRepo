import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Response } from 'express';
import { Public } from './decorator/public.decorator';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guards/roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  registerUser(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.registerUser(CreateUserDto);
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.name,req.user.role);
  }
  @Roles("ADMIN")
  @Get('protected')
  getAll(@Request() req) {
    console.log(req)
    return {
      message: `Now you can access this protected Api Route. this is you userId ${req.user.id}`,
    };
  }
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const response = await this.authService.login(
      req.user.id,
      req.user.name,
      req.user.role

    );
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role=${response.role}`
    );
  }



  @Post('/signout')
  async signOut(@Req() req){
    return this.authService.signOut(req.user.id);
  }
}
