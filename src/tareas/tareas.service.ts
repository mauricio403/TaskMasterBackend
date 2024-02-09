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

  async findTaskByUUID(id: string) {

    try {

      const task = await this.taskRepository.findOne({ where: { id } })

      if (!task) throw new NotFoundException('Task Not Found');

      return {
        msg: 'OK',
        code: '200',
        data: task
      }


    } catch (error) {
      this.handleDBErrors(error);
    }



  }

  async updateTask(id: string, updateTareaDto: UpdateTareaDto) {

    const { description, estado, expiration_date, priority, title } = updateTareaDto;

    const taskToUpdate = await this.taskRepository.preload({ id, description, estado, expiration_date, priority, title });

    if (!taskToUpdate) throw new NotFoundException('Task not found!');

    try {
      await this.taskRepository.save(taskToUpdate);
      return {
        msg:'Task updated successfully!',
        status: '200',
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
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
