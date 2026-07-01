import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { BookEntity } from './books/entities/book.entity';
import { AuthorEntity } from './authors/entities/author.entity';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [BookEntity, AuthorEntity],
      synchronize: true,
    }),
    BooksModule,
    AuthorsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
