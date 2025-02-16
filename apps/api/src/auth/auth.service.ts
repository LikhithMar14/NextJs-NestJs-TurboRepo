import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    console.log("USER: ",user)
    if(user) { console.log("User already Exists")
       throw new ConflictException("User already Exists")};
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
  
}
