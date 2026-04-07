import { Controller, Post, UseGuards, Body, Req, Delete, Param, ParseIntPipe, Res, Get } from '@nestjs/common';
import { UserUploadDto } from './dto/user.upload';
import { GenerationService } from './generation.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('generation')
@UseGuards(AuthGuard('jwt'))
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('upload')
  async upload(
    @Body() userUploadDto: UserUploadDto, 
    @Res() res: Response 
  ) {
    
    (res as any).setHeader('Content-Type', 'text/event-stream');
    (res as any).setHeader('Cache-Control', 'no-cache');
    (res as any).setHeader('Connection', 'keep-alive');

    try {
      
      const observable = await this.generationService.callCozeApi(userUploadDto);

      
      const subscription = observable.subscribe({
        next: (event: any) => {
          // 按照 SSE 格式写入：data: 内容\n\n
          (res as any).write(`data: ${JSON.stringify(event.data)}\n\n`);
        },
        error: (err) => {
          console.error('流处理出错:', err);
          (res as any).end();
        },
        complete: () => {
          // 发送结束标识并关闭连接
          (res as any).write('data: "[DONE]"\n\n');
          (res as any).end();
        }
      });

      //  当客户端主动断开连接时，取消订阅防止内存泄漏
      (res as any).on('close', () => {
        subscription.unsubscribe();
      });

    } catch (err) {
      console.error('开启流失败:', err);
      (res as any).status(500).send('Internal Server Error');
    }
  }

  @Post('save')
  async saveRecords(
    @Req() req:any,
    @Body() body:{input:UserUploadDto;result:{coupleImgUrl:string;blessing:string}}
  ){
    try{
      const userId = req.user.id;
      return this.generationService.saveRecords(userId,body.input,body.result);
    }catch(err){
      throw err    
    }
  }

  @Delete(':id')
  async deleteRecord(
    @Req() req:any,
    @Param('id',ParseIntPipe) id:number
  ){
    try{
      const userId = req.user.id;
      return this.generationService.deleteRecords(userId,id);
    }catch(err){
      throw err;
    }
  }

  @Get('records')
  async getRecords(
    @Req() req:any,
  ){
    try{
      const userId = req.user.id;
      return this.generationService.getRecords(userId);
    }catch(err){
      throw err;
    }
  }
}
