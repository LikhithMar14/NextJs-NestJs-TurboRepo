import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { log } from 'console';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { Role } from '@prisma/client';

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
      role:user.role
    }
  }

  async login(userId:number,name:string,role:Role){
    const { accessToken,refreshToken } =  await this.generateToken(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId,hashedRT);
    return{
      id:userId,
      name:name,
      role,
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
    const currentUser = { id: user.id,role:user.role};

    return currentUser
  }

  async validateRefreshToken(userId:number,refreshToken:string){
    const user = await this.userService.findOne(userId);
    if(!user)throw new UnauthorizedException("User not found!");
    const refreshTokenMatched = await verify(user.hashedRefreshToken!,refreshToken)

    if(!refreshTokenMatched)throw new UnauthorizedException("Invalid refresh token");
    const currentUser = { id: user.id};
    return currentUser
  }

  async refreshToken(userId:number,name?:string){
    const { accessToken,refreshToken } =  await this.generateToken(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId,hashedRT);



    return{
      id:userId,
      name:name,
      accessToken,
      refreshToken
    }
  }
  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async signOut(userId:number){
    return this.userService.updateHashedRefreshToken(userId,null)
  }



  
}
