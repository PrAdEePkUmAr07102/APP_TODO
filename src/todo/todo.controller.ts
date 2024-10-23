import { Controller, Post, Body, UseGuards,Req, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Update with the correct path
import { CreateTodoDto } from './dto/todo.dto';
import { TodoEntity, TodoStatusEnum } from 'src/entity/todo.entity';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { paginationTodoDto } from './dto/pagination.dto';
import { TodoStatus } from './dto/todoStatus.dto';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

     @UseGuards(JwtAuthGuard)
     @Post()
     async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req): Promise<TodoEntity> {
         const tokenPayload = req.user;
         console.log("Token Payload:", tokenPayload); // This already logs the correct payload
     
         const userId = tokenPayload.userId; // Extract 'id' instead of 'userId'
         console.log("Extracted userId (id):", userId); // Log the extracted id
     
         return this.todoService.createTodo(createTodoDto, userId );
     }


     @UseGuards(JwtAuthGuard)
     @Get()
     async getSingleUserTodos(@Query() paginationTodoDto:paginationTodoDto, @Req() req){
        const userId = req.user.userId;
        return this.todoService.getSingleUserTodos(userId,paginationTodoDto);
     }

     @Put(':id')
     async updateUserTodo(@Param('id') id:string, @Body() updateUserTodo:UpdateTodoDto){
        return this.todoService.updateUserTodo(id,updateUserTodo)
     }
     

     @Delete(':id')
     async deleteUserTodo(@Param('id') id:string){
      return this.todoService.deleteUserTodo(id)
     }

     @Put('/api/:id')
     async updateTodoStatus(@Param('id') id:string, @Body() todoStatus:TodoStatus ){
      return this.todoService.updateTodoStatus(id,todoStatus);
     }




     







}






