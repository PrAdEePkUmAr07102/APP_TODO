import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class paginationTodoDto{

    @IsNumber()
    @IsPositive()
    @IsOptional()
    page:number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit:number;
}