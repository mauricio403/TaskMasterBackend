import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';


@UseGuards(AuthGuard())
@Controller('tasks')
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }



  @Post()
  create(@Body() createTareaDto: CreateTareaDto, @getUser() user: User) {
    return this.tareasService.create(createTareaDto, user);
  }

  @Get()
  findTasksByUser(@getUser() user: User) {
    return this.tareasService.findTasksByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(+id, updateTareaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }



}
