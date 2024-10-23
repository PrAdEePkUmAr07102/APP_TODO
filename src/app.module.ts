
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersEntity } from './entity/users.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TodoEntity } from './entity/todo.entity';
import { TodoModule } from './todo/todo.module';
import { MailerModule } from './mailer/mailer.module';



@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Make ConfigModule global for environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8080,            
      username: 'postgres',  
      password: 'Prad@2002',   
      database: 'todo_app',     
      entities: [UsersEntity,TodoEntity], 
      synchronize: true,      
    }),

    TypeOrmModule.forFeature([UsersEntity, TodoEntity]),

    UsersModule,

    TodoModule,

    MailerModule,

  

    

     
  ],

  controllers: [AppController],

  providers: [AppService],

})

export class AppModule {}

