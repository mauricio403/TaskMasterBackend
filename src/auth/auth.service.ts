import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class AuthService {
  registerUser(createAuthDto: CreateUserDto) {
    return {
      status: 200,
      msg: 'User register',
      ...createAuthDto
    };
  }

}
