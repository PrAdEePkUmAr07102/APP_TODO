import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity, TodoStatusEnum } from 'src/entity/todo.entity';
import { UsersEntity } from 'src/entity/users.entity';
import { Code, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/todo.dto';
import { UpdateTodoDto } from './dto/updatetodo.dto';
import { paginationTodoDto } from './dto/pagination.dto';
import { TodoStatus } from './dto/todoStatus.dto';



@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(TodoEntity)
        private todoRepository:Repository<TodoEntity>,

        @InjectRepository(UsersEntity)
        private usersRepository:Repository<UsersEntity>,
    ){}

    //CREATE TODO 

    async createTodo(createTodoDto: CreateTodoDto, userId: string): Promise<TodoEntity> {
        console.log("Incoming userId:", userId)
        const { description, date, startTime, endTime } = createTodoDto;
    
        // Check if a TODO exists for the same date and same time for the user
        const existingTodo = await this.todoRepository.findOne({
            where: {
                userId: userId, // This checks against the userId relation
                date,
                startTime,
                endTime,
            },
        });
    
        if (existingTodo) {
            throw new BadRequestException('Todo for the same day and same time already exists');
        }
    
        // Find the user by userId to ensure they exist
        const user = await this.usersRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            throw new BadRequestException('User not found');
        }
    
let todo= new TodoEntity();
todo.description= description;
todo.date= date;
todo.startTime= startTime;
todo.endTime= endTime;
todo.user= user;


    
        return this.todoRepository.save(todo);
    }
    
    //GET ALL TODOS OF SINGLE USER  BY ASCENDING

    async getSingleUserTodos(userId:string,paginationTodoDto:paginationTodoDto){

        // const user = await this.usersRepository.findOne({where:{id:userId}});
        // if(!user){
        //     throw new BadRequestException('User Not Found');
        // }

        
        let page = paginationTodoDto.page;
        let limit = paginationTodoDto.limit;
        let skip = (page-1)*limit;

        const userTodos = await this.todoRepository.find({
            where:{user:{id: userId}}, skip:skip||0, take:limit||Number.MAX_SAFE_INTEGER, relations:["user"],
            order: {createdAt:'ASC'},
        })

    

        const existingTodo = await this.todoRepository.find({where:{user:{id:userId}},order:{createdAt:'ASC'}});
        const userTodoCount = existingTodo.length;
        const currentPage = page;
        const totalPage = Math.ceil(userTodoCount/limit);
        const details = {'Existing_todos':userTodoCount,'Current_Page':currentPage,'Total_Page':totalPage};


        if(!userTodos || userTodos.length===0){
            throw new BadRequestException('No Todos found');
        }

        return {
            Code:"success",
            data:userTodos,
            metaData:details,
            message:null,

        }

    }


    //UPDATE TODO 


    async updateUserTodo(id:string,updateTodo:UpdateTodoDto):Promise<TodoEntity>{
        const userTodo = await this.todoRepository.findOne({where:{id}});
        if(!userTodo){
            throw new BadRequestException('todo Not Found');
        }
        
        userTodo.date= updateTodo.date?? userTodo.date;
        userTodo.description= updateTodo.description?? userTodo.description;
        userTodo.startTime = updateTodo.startTime?? userTodo.startTime;
        userTodo.endTime = updateTodo.endTime?? userTodo.endTime;

        try {
            return this.todoRepository.save(userTodo);
        } catch (error) {
            throw new UnauthorizedException('User Not Updated Successfully');
        }
    }


    //DELETE TODO

    async deleteUserTodo(id:string){
        const existingTodo = await this.todoRepository.findOne({where:{id}});
        if(!existingTodo){
            throw new BadRequestException('Todo Not Found');
        }
        try {
            await this.todoRepository.delete({id})
            return 'Todo Deleted Successfully';
        } catch (error) {
            throw new BadRequestException('TODO NOT DELETED');
        }
    }


    //UPDATE STATUS

    async updateTodoStatus(id:string, todoStatus:TodoStatus){

        const existingTodo = await this.todoRepository.findOne({where:{id}});  
        
        const now = new Date();
   
        const todoDate = new Date(existingTodo.date);

        const endTime =  new Date(`${existingTodo.date}T${existingTodo.endTime}`);  
    

        if (todoDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            throw new BadRequestException('Cannot update the status of past todos.');
        }
  
  
       if (existingTodo.status===TodoStatusEnum.not_Started && now > endTime) {
           throw new BadRequestException('Cannot mark an expired todo as in progress.');
        }

       if(!existingTodo){
            throw new BadRequestException('todo Not Found');
        }

        existingTodo.status = todoStatus.status;

        return this.todoRepository.save(existingTodo);

    }

}



