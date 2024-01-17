import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './entities/tarea.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TareasController],
  providers: [TareasService],
  imports: [
    TypeOrmModule.forFeature([Tarea]),
    AuthModule
  ],
  exports: [
    TypeOrmModule
  ]
})
export class TareasModule { }
