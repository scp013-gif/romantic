import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // 存储路径：项目根目录下的 uploads 文件夹
        destination: './uploads',
        filename: (req, file, cb) => {
          // 生成唯一文件名：时间戳 + 随机数 + 原始后缀
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // 仅允许图片类型
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('只允许上传图片文件！'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 限制 10MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('未接收到文件');
    }

    
    const baseUrl = 'http://localhost:3000';
    
    // 返回给前端的完整访问 URL
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}