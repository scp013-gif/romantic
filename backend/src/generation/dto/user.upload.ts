import { IsNotEmpty, IsString } from 'class-validator';

export class UserUploadDto {
    @IsNotEmpty()
    @IsString()
    maleImg: string;
    @IsNotEmpty()
    @IsString()
    femaleImg: string;
    @IsNotEmpty()
    @IsString()
    style: string;
    @IsNotEmpty()
    @IsString()
    scene: string;
}
