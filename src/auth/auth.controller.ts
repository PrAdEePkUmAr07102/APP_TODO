import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/users/dto/login.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}


    @Post('login')
    async login(@Body() loginDto:LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if(!user){
            throw new UnauthorizedException();
        }

        return this.authService.login(user);
    }
}


