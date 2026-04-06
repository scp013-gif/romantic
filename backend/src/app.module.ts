import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GenerationModule } from './generation/generation.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),  PrismaModule, AuthModule, GenerationModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
