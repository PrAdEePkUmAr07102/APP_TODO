// src/users/dto/update-user.dto.ts
import { IsOptional, IsString, IsEmail, IsPhoneNumber, isString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Allow the name to be optional
  @IsString()
  firstName?: string;


  @IsOptional()
  @IsString()
  lastName?:string;


  @IsOptional() 
  @IsEmail()
  email?: string;


  @IsOptional()
  phoneNumber?: string;


  @IsOptional()
  @IsString()
  password?: string; // If the password needs to be updated
}
