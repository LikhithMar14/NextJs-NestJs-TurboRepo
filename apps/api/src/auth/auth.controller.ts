import { Request,Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { log } from 'console';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  registerUser(@Body() CreateUserDto:CreateUserDto){
    return this.authService.registerUser(CreateUserDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  login(@Request() req){
    log(req.user)
    return this.authService.login(req.user.id,req.user.name);
  }
  @UseGuards(JwtAuthGuard)
  @Get("protected")
  getAll(@Request() req){
    return  {message: `Now you can access this protected Api Route. this is you userId ${req.user.id}` }
  }
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refresh(@Request() req){
    
  }
}
