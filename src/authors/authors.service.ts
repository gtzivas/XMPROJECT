import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorResponseDto } from './dto/author-response.dto';
import { BooksRepository } from '../books/books.repository';
import { BookEntity } from '../books/entities/book.entity';
import { BookResponseDto } from '../books/dto/book-response.dto';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly booksRepository: BooksRepository,
  ) {}

  async findAll(): Promise<AuthorResponseDto[]> {
    const authors = await this.authorsRepository.findAll();

    return Promise.all(authors.map((author) => this.toResponse(author)));
  }

  async findOne(id: number): Promise<AuthorResponseDto> {
    const author = await this.getAuthorOrFail(id);

    return this.toResponse(author);
  }

  async create(dto: CreateAuthorDto): Promise<AuthorResponseDto> {
    const author = this.authorsRepository.create({
      name: dto.name,
      nationality: dto.nationality ?? null,
      birthYear: dto.birthYear ?? null,
    });

    const saved = await this.authorsRepository.save(author);

    return this.toResponse(saved);
  }

  async findBooks(id: number): Promise<BookResponseDto[]> {
    const author = await this.getAuthorOrFail(id);
    const books = await this.booksRepository.findByAuthorName(author.name);

    return books.map((book) => this.toBookResponse(book));
  }

  private async getAuthorOrFail(id: number): Promise<AuthorEntity> {
    const author = await this.authorsRepository.findById(id);

    if (author === null) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }

  private async toResponse(author: AuthorEntity): Promise<AuthorResponseDto> {
    const books = await this.booksRepository.findByAuthorName(author.name);

    return {
      id: author.id,
      name: author.name,
      nationality: author.nationality,
      birthYear: author.birthYear,
      books: books.map((book) => this.toBookResponse(book)),
    };
  }

  private toBookResponse(book: BookEntity): BookResponseDto {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      genre: book.genre,
    };
  }
}
