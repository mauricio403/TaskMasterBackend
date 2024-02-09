import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categoria.entity';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {

    const { categoryName } = createCategoriaDto;

    const categoryNameExist = await this.getCategoryByName(categoryName);

    if (categoryNameExist) throw new BadRequestException(`Category with name ${categoryName} already exist!`);

    const category = await this.categoryRepository.create({ categoryName });

    try {

      await this.categoryRepository.save(category);

      return {
        msg: 'Category created successfully',
        status: '201',
        data: category
      }

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async getAllCategories() {

    const categories = await this.categoryRepository.find();

    if (!categories.length) throw new NotFoundException('Not Found Categories!');

    return {
      msg: 'OK',
      code: '200',
      data: categories
    }
  }


  private async getCategoryByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { categoryName: name } });
    
    return category ?? undefined;
  }

  private handleDBErrors(error: any) {
    if (error.detail) {
      throw new BadRequestException(error.detail)
    }
    console.log(error);
    throw new InternalServerErrorException('Please check internal logs');
  }


}
