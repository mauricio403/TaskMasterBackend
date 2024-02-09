import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TareasService {

  private readonly logger = new Logger('TaskService');


  constructor(
    @InjectRepository(Tarea)
    private readonly taskRepository: Repository<Tarea>,
  ) { }

  async create(createTareaDto: CreateTareaDto, user: User) {

    try {
      const task = await this.taskRepository.create({
        ...createTareaDto,
        user
      });

      await this.taskRepository.save(task);

      return {
        msg: 'New Task save',
        status: '201',
        ...task
      }

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async findTasksByUser(user: User) {

    try {
      const tasksByUser = await this.taskRepository.find({
        where: { user: { id: user.id } }
      });

      if (!tasksByUser.length) {
        throw new NotFoundException('No tasks found');
      };

      return {
        msg: 'Tasks Found for authenticated user',
        status: '200',
        data: tasksByUser
      }


    } catch (error) {
      this.handleDBErrors(error);
    }


  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTareaDto: UpdateTareaDto) {
    return `This action updates a #${id} tarea`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarea`;
  }

  private handleDBErrors(error: any) {
    if (error.detail) {
      throw new BadRequestException(error.detail)
    }
    console.log(error);
    throw new InternalServerErrorException('Please check internal logs');
  }
}
