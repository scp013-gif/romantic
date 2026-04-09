import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(
    private prisma:PrismaService,
    private jwtService:JwtService
  ){

  }

  private generateTokens(userId:number){
    const accessToken = this.jwtService.sign(
      {sub:userId},
      {
        secret:process.env.JWT_ACCESS_SECRET,
        expiresIn:'15m'
      }
    )

    const refreshToken = this.jwtService.sign(
      {sub:userId},
      {
        secret:process.env.JWT_REFRESH_SECRET,
        expiresIn:'7d'
      }
    )
    return {accessToken,refreshToken}
  }

  async login(loginDto:LoginDto){
    const {username,password} = loginDto;
    const user = await this.prisma.user.findUnique({
      where:{username}
    })
    if(!user){
      throw new BadRequestException('用户名不存在');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      throw new BadRequestException('密码错误');
    }
    const tokens = this.generateTokens(user.id);
    return {user,...tokens};
  }

  async refresh(refreshToken:string){
    try{
      const payload = this.jwtService.verify(refreshToken,{
        secret:process.env.JWT_REFRESH_SECRET,
      })
      if(!payload.sub){
        throw new BadRequestException('刷新token失败,请重新登录');
      }
      const newAccessToken = this.jwtService.sign(
        {sub:payload.sub},
        {
          secret:process.env.JWT_ACCESS_SECRET,
          expiresIn:'15m'
        }
      )
      return {accessToken:newAccessToken}
    }catch(err){
      throw new BadRequestException('刷新token失败,请重新登录');
    }
  }

  async register(registerDto:LoginDto){
    const {username,password} = registerDto;
    const exsist = await this.prisma.user.findUnique({
      where:{username}
    })
    if(exsist){
      throw new BadRequestException('用户名已存在');
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await this.prisma.user.create({
      data:{
        username,
        password:hashedPassword
      },
      select:{id:true,username:true}
    })
    const token = this.generateTokens(user.id);
    return {user,...token  }
  }
}
