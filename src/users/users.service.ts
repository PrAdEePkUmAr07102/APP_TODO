import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entity/users.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { userDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchDto } from './dto/search.dto';
import { MailerService } from 'src/mailer/mailer.service';



@Injectable()
export class UsersService {
   
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
        private readonly jwtService: JwtService,
        private readonly mailerService:MailerService,

    ) {}

    //SIGNUP 

    async create(details: userDto): Promise<UsersEntity> {
     
        const hashedPassword = await bcrypt.hash(details.password, 10);

        // Format the phone number
        let phone = details.phoneNumber;
        if (!phone.startsWith('+91')) {
            phone = `+91${phone}`;
        }

        const user = this.usersRepository.create({ ...details, password: hashedPassword, phoneNumber: phone });

        try {

            await this.mailerService.sendMail(
                 user.email,
                'WELCOME TO OUR SERVICE',
                'Thank you for registering!',
            );

            return await this.usersRepository.save(user);
        } catch (error) {
            throw new BadRequestException('Failed to create user');
        }
    }

    //LOGIN 

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto; // Extract email and password
        if (!email) {
            throw new UnauthorizedException('Email is required');
        }
        if (!password) {
            throw new UnauthorizedException('Password is required');
        }
        
        // Find user by email
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        // Compare the hashed password
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid password');
        }

        // Generate JWT token
        const token = { email: user.email, userId: user.id, first_name:user.firstName, phone:user.phoneNumber};
        const accessToken = this.jwtService.sign(token);

        return { accessToken };
    }

    
    //UPDATE USER

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UsersEntity> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // If password is being updated, hash it before saving 
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }


        //If PhoneNumber is Updated ,store with Indian Number
        if (!updateUserDto.phoneNumber.startsWith('+91')) {
            updateUserDto.phoneNumber = `+91${updateUserDto.phoneNumber}`
        }

        

        user.firstName = updateUserDto.firstName??user.firstName;
        user.lastName = updateUserDto.lastName??user.lastName;
        user.email = updateUserDto.email??user.email;
        user.password = updateUserDto.password??user.password;
        user.phoneNumber = updateUserDto.phoneNumber??user.phoneNumber;   

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    //DELETE USERS 


async deleteUsers(id: string): Promise<string> {

    // Find the user by ID

    const user = await this.usersRepository.findOne({ where: { id: id } });

    // Check if the user exists

    if (!user) {
        throw new UnauthorizedException('User Not Found');
    }

    // Perform a soft delete by setting 'isDeleted' to true and other fields to null

    await this.usersRepository.update(id, {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        phoneNumber: null,
        isDeleted: true,  
        updatedAt: new Date() 
    });

    return 'User deleted successfully';
}

//GET SINGLE USER

async getSingleUser(id:string):Promise<UsersEntity>{
    const user = await this.usersRepository.findOne({where:{id}})
    if(!user){
        throw new UnauthorizedException('User Not Found');
    }

    return (user);
}


//GET ALL USERS

async getAllUsers(paginationDto:PaginationDto,searchDto:SearchDto){
    let page = paginationDto.page;
    let limit = paginationDto.limit;
    let skip = (page-1)*limit;
    const {searchText} = searchDto;
    
    const conditions:FindOptionsWhere<UsersEntity> | FindOptionsWhere<UsersEntity> [] ={
       isDeleted:false,
       
       ...(searchText ? { firstName: ILike(`%${searchText}%`) } : {}),
       // ...(firstName ? { firstName: ILike(firstName)} : {}),    
    
    };



    const paginationUsers = await this.usersRepository.find({where:conditions,skip:skip||0,take:paginationDto.limit||Number.MAX_SAFE_INTEGER});
    const existingUsers = this.usersRepository.find({where:{isDeleted:false}}) 
    const usersCount = (await existingUsers).length
    const currentPage = page;
    const totalPage = Math.ceil(usersCount/limit);

    const details = {'Existing_Users_Count':usersCount,'Total_Page':totalPage,'Current_Page':currentPage}
    
 
    return{
        code: "success",
        data: paginationUsers,
        metaData: details,
        message: null
    }

};
    
    

}



















