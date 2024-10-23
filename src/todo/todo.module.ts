import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from 'src/entity/todo.entity';
import { UsersEntity } from 'src/entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity,UsersEntity]),
    AuthModule,
  ],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
