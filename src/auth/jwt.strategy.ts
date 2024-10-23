import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersEntity } from "src/entity/users.entity";
import { Repository } from "typeorm";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
        private configService: ConfigService, //confid service to access env variables
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extract token from authtorization header(bearer token)
            ignoreExpiration:false,
            secretOrKey: configService.get('JWT_SECRET'),   //GET THE SECRET KEY FROM ENV VARAIABLES 
        });
    }

    //THIS METHOS WILL BE INVOKED WHEN THE TOKEN IS VALIDATED
    async validate(payload: any) {
        console.log('Payload:', payload);  // Check the payload structure
        return { userId: payload.userId, email: payload.email };  // Extract `userId`
      }
      
}

 
