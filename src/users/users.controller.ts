import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service'; 
import { userDto } from './dto/user.dto';
import { UsersEntity } from 'src/entity/users.entity';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchDto } from './dto/search.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService){}


    @Post('signup')
    async create(@Body() details:userDto ):Promise<UsersEntity>{
        return this.usersService.create(details);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }


    // Update user details by ID

    @Put(':id')
    async updateUser(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto){
        return this.usersService.updateUser(id,updateUserDto);
    }


    //delete Users 

    @Delete(':id')
    async deleteUsers(@Param('id') id:string){
        return this.usersService.deleteUsers(id);
    }


    @Get (':id')
    async getSingleUser(@Param('id') id:string):Promise<UsersEntity>{
        return this.usersService.getSingleUser(id);
    }


    @Get()
    async getAllUsers(@Query() paginationDto:PaginationDto,@Query()searchDto:SearchDto ){
        return this.usersService.getAllUsers(paginationDto,searchDto);
    }



   


}



    

