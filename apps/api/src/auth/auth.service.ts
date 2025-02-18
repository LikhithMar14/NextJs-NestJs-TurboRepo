import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { log } from 'console';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig:ConfigType<typeof refreshConfig>) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if(user) { console.log("User already Exists")
       throw new ConflictException("User already Exists")};
        log("Created User successfully")
    return this.userService.create(createUserDto);
     
  }

  async validateLocalUser(email:string, password:string){
    const user = await this.userService.findByEmail(email);
    if(!user)throw new UnauthorizedException("User not found!");
    const isPasswordMatched = verify((user).password,password);
    if(!isPasswordMatched)throw new UnauthorizedException("Invalid Credentials!");


    return {
      id:user.id,
      name:user.name,
    }
  }

  async login(userId:number,name?:string){
    const { accessToken,refreshToken } =  await this.generateToken(userId);
    return{
      id:userId,
      name:name,
      accessToken,
      refreshToken
    }
  }

  async generateToken(userId:number){
    const payload:AuthJwtPayload = {sub:userId};
    const [accessToken,refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload,this.refreshTokenConfig)
    ])

    return{
      accessToken,
      refreshToken
    }
  }

  async validateJwtUser(userId:number){
    const user = await this.userService.findOne(userId);
    if(!user)throw new UnauthorizedException("User not found!");
    const currentUser = { id: user.id};
    return currentUser
  }

  async validateRefreshToken(userId:number){
    const user = await this.userService.findOne(userId);
    if(!user)throw new UnauthorizedException("User not found!");
    const currentUser = { id: user.id};
    return currentUser
  }

  async refreshToken(userId:number,name?:string){
    const { accessToken,refreshToken } =  await this.generateToken(userId);

    console.log(accessToken,refreshToken)

    return{
      id:userId,
      name:name,
      accessToken,
      refreshToken
    }
  }
  
}
