import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService

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

  async loginUser(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
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
