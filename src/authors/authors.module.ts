import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { AuthorEntity } from './entities/author.entity';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity]), BooksModule],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
})
export class AuthorsModule {}
