import { Controller, Post, UseGuards, Body, Sse, Req, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { UserUploadDto } from './dto/user.upload';
import { GenerationService } from './generation.service';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Controller('generation')

export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Sse('upload')
  @Post('upload')
  async upload(@Body() userUploadDto: UserUploadDto):Promise<Observable<MessageEvent>> {
    try{
      return await this.generationService.callCozeApi(userUploadDto);
    }catch(err){
      throw err;
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
}
