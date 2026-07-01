import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './entities/book.entity';

interface BookFilter {
  readonly genre?: string;
  readonly author?: string;
}

@Injectable()
export class BooksRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repository: Repository<BookEntity>,
  ) {}

  findAll(filter: BookFilter = {}): Promise<BookEntity[]> {
    const query = this.repository.createQueryBuilder('book');

    if (filter.genre !== undefined) {
      query.andWhere('LOWER(book.genre) = LOWER(:genre)', {
        genre: filter.genre,
      });
    }

    if (filter.author !== undefined) {
      query.andWhere('LOWER(book.author) = LOWER(:author)', {
        author: filter.author,
      });
    }

    return query.getMany();
  }

  findById(id: number): Promise<BookEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByIsbn(isbn: string): Promise<BookEntity | null> {
    return this.repository.findOne({ where: { isbn } });
  }

  findByAuthorName(name: string): Promise<BookEntity[]> {
    return this.repository
      .createQueryBuilder('book')
      .where('LOWER(book.author) = LOWER(:name)', { name })
      .getMany();
  }

  create(data: Partial<BookEntity>): BookEntity {
    return this.repository.create(data);
  }

  save(entity: BookEntity): Promise<BookEntity> {
    return this.repository.save(entity);
  }

  async remove(entity: BookEntity): Promise<void> {
    await this.repository.remove(entity);
  }
}
