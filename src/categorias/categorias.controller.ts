import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller('categories')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  createCategory(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  getAllCategories() {
    return this.categoriasService.getAllCategories();
  }

}
