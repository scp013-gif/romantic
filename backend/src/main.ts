import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  app.setGlobalPrefix('api');

  // 核心配置：将物理路径映射到 URL 路径
  // 访问 http://localhost:3000/uploads/xxx.jpg 对应物理路径 /uploads/xxx.jpg
  (app as NestExpressApplication).useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
