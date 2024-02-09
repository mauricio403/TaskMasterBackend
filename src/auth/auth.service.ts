import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { ResendService } from 'nestjs-resend';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly resendService: ResendService

  ) { }


  async registerUser(createUserDTO: CreateUserDto) {
    try {
      const userRequest = createUserDTO;

      const user = this.userRepository.create({
        ...userRequest,
        password: bcrypt.hashSync(userRequest.password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      await this.resendService.send({
        from:'test@mau.com',
        to:user.email,
        subject:'hello world',
        text:'works!!'
      });

      return {
        msg: 'User created successfully!',
        status: '200',
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      this.handleDBErrors(error);
    }

  };


  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    const { email, userName } = updateUserDto;

    const user = await this.userRepository.preload({ id, email, userName });

    if (!user) throw new NotFoundException('User not found!');

    if (email) {
      const userExistEmail = await this.userRepository.findOne({ where: { email } });
      if (userExistEmail) throw new BadRequestException('Email  already exist!');
    }

    if(userName) {
      const existUserName = await this.userRepository.findOne({ where: { userName } });
      if (existUserName) throw new BadRequestException(' user name already exist!');
    }


    await this.userRepository.save(user);

    return {
      msg: 'User updated successfully!',
      status: '201',
      ...user
    }

  }


  async loginUser(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, userName: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found or not exist!')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid')
    }

    return {
      msg: 'Login Successfully',
      status: '201',
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  async restorePassowrd(restorePasswordDto: UpdateUserDto) {
    //TODO re_7VErGHzC_Jp7Puh3i5KpHtcY4XWxwPrMF
  }






  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token
  }

  private handleDBErrors(error: any) {
    if (error.detail) {
      throw new BadRequestException(error.detail)
    }
    console.log(error);
    throw new InternalServerErrorException('Please check internal logs');
  }


}
