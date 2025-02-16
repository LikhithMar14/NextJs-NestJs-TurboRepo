import { Request,Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { log } from 'console';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';



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
    return req.user;
  }
}
