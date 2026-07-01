import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';
import { BookResponseDto } from '../books/dto/book-response.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll(): Promise<AuthorResponseDto[]> {
    return this.authorsService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAuthorDto): Promise<AuthorResponseDto> {
    return this.authorsService.create(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuthorResponseDto> {
    return this.authorsService.findOne(id);
  }

  @Get(':id/books')
  findBooks(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponseDto[]> {
    return this.authorsService.findBooks(id);
  }
}
