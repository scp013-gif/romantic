import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt,Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload:{sub:number}){
    const user = await this.prismaService.user.findUnique({
        where:{id:payload.sub},
        select:{id:true,username:true}
    })
    if(!user){
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
}
