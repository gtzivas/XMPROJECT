import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { BookEntity } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BooksController],
  providers: [BooksService, BooksRepository],
  exports: [BooksRepository],
})
export class BooksModule {}
