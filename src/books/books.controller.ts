import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { BookResponseDto } from './dto/book-response.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() query: QueryBooksDto): Promise<BookResponseDto[]> {
    return this.booksService.findAll(query);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.booksService.create(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
