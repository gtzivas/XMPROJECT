import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { BookResponseDto } from './dto/book-response.dto';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async findAll(query: QueryBooksDto): Promise<BookResponseDto[]> {
    const books = await this.booksRepository.findAll({
      genre: query.genre,
      author: query.author,
    });

    return books.map((book) => this.toResponse(book));
  }

  async findOne(id: number): Promise<BookResponseDto> {
    const book = await this.getBookOrFail(id);

    return this.toResponse(book);
  }

  async create(dto: CreateBookDto): Promise<BookResponseDto> {
    const existing = await this.booksRepository.findByIsbn(dto.isbn);

    if (existing !== null) {
      throw new ConflictException(
        `A book with ISBN '${dto.isbn}' already exists`,
      );
    }

    const book = this.booksRepository.create({
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      publishedYear: dto.publishedYear,
      genre: dto.genre ?? null,
    });

    const saved = await this.booksRepository.save(book);

    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateBookDto): Promise<BookResponseDto> {
    const book = await this.getBookOrFail(id);

    const isbnOwner = await this.booksRepository.findByIsbn(dto.isbn);

    if (isbnOwner !== null && isbnOwner.id !== id) {
      throw new ConflictException(
        `A book with ISBN '${dto.isbn}' already exists`,
      );
    }

    book.title = dto.title;
    book.author = dto.author;
    book.isbn = dto.isbn;
    book.publishedYear = dto.publishedYear;
    book.genre = dto.genre ?? null;

    const saved = await this.booksRepository.save(book);

    return this.toResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const book = await this.getBookOrFail(id);

    await this.booksRepository.remove(book);
  }

  private async getBookOrFail(id: number): Promise<BookEntity> {
    const book = await this.booksRepository.findById(id);

    if (book === null) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    return book;
  }

  private toResponse(book: BookEntity): BookResponseDto {
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
