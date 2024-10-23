import { IsDateString, IsMilitaryTime, IsNotEmpty, IsString } from "class-validator";


export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    description:string;


    @IsNotEmpty()
    @IsDateString()
    date:string;


    @IsNotEmpty()
    @IsMilitaryTime()
    startTime:string;


    @IsNotEmpty()
    @IsMilitaryTime()
    endTime:string;
}