import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "src/entity/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';


Injectable()
export class AuthService{
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository:Repository<UsersEntity>,   //INJECT USERS TABLE

        private jwtService:JwtService,    //IMPLEMENT JWT FOR VERIFY TOKEN
    ){}


    //TO VALIDATE A USER DURING LOGIN

    async validateUser(email: string,password: string):Promise<any> {
        const user = await this.usersRepository.findOne({where:{email}});
        if(user && (await bcrypt.compare(password,user.password))) {
            const { password, ...result} = user;
            return result;  //RETURN USER DATA WITHOUT PASSWORD IF VALIDATION SUCCESS;
        }

        return null;
            
    }


    //GENERATE JWT TOKEN AND LOGIN
    async login(user: any) {
        const payload = { email: user.email, userId: user.id };  
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      


    //VALIDATE JWT TOKEN 
    async validateJwtToken(token: string): Promise<any>{
        try {
            const validateToken = this.jwtService.verify(token);
            return validateToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid Token');
        }
    }
}