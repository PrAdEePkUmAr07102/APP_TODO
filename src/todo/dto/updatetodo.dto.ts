import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateTodoDto{

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsString()
    date:string;

    @IsNotEmpty()
    @IsString()
    startTime:string;

    @IsNotEmpty()
    @IsString()
    endTime:string;

}