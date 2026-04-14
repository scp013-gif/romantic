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
      await this.generationService.callCozeApi(userUploadDto,(data) => {
        (res as any).write(`data: ${data}\n\n`)
      });
      (res as any).end()
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
