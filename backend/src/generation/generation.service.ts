import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CozeAPI } from '@coze/api';
import { UserUploadDto } from './dto/user.upload';
@Injectable()
export class GenerationService {
    private apiClient: CozeAPI;
    constructor(
        private prismaService: PrismaService,
    ){        
        this.apiClient = new CozeAPI({
            token:process.env.COZE_API_KEY as string,
            baseURL:process.env.COZE_API_URL,
        })
    }

    async callCozeApi(UserUploadDto:UserUploadDto ,onChunk:(data:string) => void):Promise<void>{
        const {maleImg,femaleImg,style,scene} = UserUploadDto;
        try{
                const stream = await this.apiClient.workflows.runs.stream({
                workflow_id:process.env.WORKFLOW_ID as string,
                parameters:{
                    male_img:maleImg,
                    female_img:femaleImg,
                    style:style,
                    scene:scene,
                }
            })

            for await (const part of stream) {
                if(part.event === 'Message' || part.event === 'Done') {
                    if(part.event === 'Done'){
                        onChunk('[DONE]');
                        break;
                    }
                    const data = part.data || {};
                    const content = (data as any).content || '';
                    let imageUrl = (data as any).image_url || (data as any).url || null;
                    if(!imageUrl && content.trim().startsWith('http')){
                        imageUrl = content;
                    }
                    onChunk(JSON.stringify({content,imageUrl}));
                }
            }
        }catch(err){
            console.log(err);
            return err;
        }
    }
    
    async saveRecords(
        userId:number,
        input:UserUploadDto,
        result:{coupleImgUrl:string;blessing:string}
    ){
        try{
            return await this.prismaService.generationRecord.create({
            data:{
                userId,
                maleImgUrl:input.maleImg,
                femaleImgUrl:input.femaleImg,
                style:input.style,
                scene:input.scene,
                coupleImgUrl:result.coupleImgUrl,
                blessing:result.blessing,
            }
        })
        }catch(err){
            console.log(err);
            return err;
        }
    }

    async deleteRecords(userId:number,recordId:number){
        const record = await this.prismaService.generationRecord.findFirst({
            where:{
                id:recordId,
                userId
            }
        });
        if(!record) throw new Error('记录不存在或无权删除');
        return await this.prismaService.generationRecord.delete({
            where:{
                id:recordId,
                userId
            }
        });
    }

    async getRecords(userId:number){
        try{
            return await this.prismaService.generationRecord.findMany({
                where:{
                    userId
                },
                select:{
                    id:true,
                    coupleImgUrl:true,
                    blessing:true,
                    createdAt:true,
                    style:true,
                    scene:true
                },
                orderBy:{
                    createdAt:'desc'
                }
            })
        }catch(err){
            console.log(err);
            return err;
        }
    }
    
}
