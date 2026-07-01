import { ConflictException, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksRepository } from './books.repository';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

const makeBook = (overrides: Partial<BookEntity> = {}): BookEntity => {
  const book = new BookEntity();
  book.id = 1;
  book.title = 'Clean Code';
  book.author = 'Robert Martin';
  book.isbn = '978-0132350884';
  book.publishedYear = 2008;
  book.genre = 'Programming';
  return Object.assign(book, overrides);
};

describe('BooksService', () => {
  let service: BooksService;
  let repo: jest.Mocked<BooksRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByIsbn: jest.fn(),
      findByAuthorName: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<BooksRepository>;

    service = new BooksService(repo);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all books when no filter is provided', async () => {
      const books = [makeBook(), makeBook({ id: 2, isbn: '999' })];
      repo.findAll.mockResolvedValue(books);

      const result = await service.findAll({} as QueryBooksDto);

      expect(repo.findAll).toHaveBeenCalledWith({ genre: undefined, author: undefined });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 1, title: 'Clean Code' });
    });

    it('passes genre filter to repository', async () => {
      repo.findAll.mockResolvedValue([makeBook()]);

      await service.findAll({ genre: 'Programming' } as QueryBooksDto);

      expect(repo.findAll).toHaveBeenCalledWith({ genre: 'Programming', author: undefined });
    });

    it('passes author filter to repository', async () => {
      repo.findAll.mockResolvedValue([makeBook()]);

      await service.findAll({ author: 'Robert Martin' } as QueryBooksDto);

      expect(repo.findAll).toHaveBeenCalledWith({ genre: undefined, author: 'Robert Martin' });
    });

    it('passes both filters to repository when both provided', async () => {
      repo.findAll.mockResolvedValue([makeBook()]);

      await service.findAll({ genre: 'Programming', author: 'Robert Martin' } as QueryBooksDto);

      expect(repo.findAll).toHaveBeenCalledWith({
        genre: 'Programming',
        author: 'Robert Martin',
      });
    });

    it('returns empty array when no books match', async () => {
      repo.findAll.mockResolvedValue([]);

      const result = await service.findAll({ genre: 'Horror' } as QueryBooksDto);

      expect(result).toEqual([]);
    });
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates and returns a book', async () => {
      const dto: CreateBookDto = {
        title: 'Clean Code',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publishedYear: 2008,
        genre: 'Programming',
      };
      const entity = makeBook();
      repo.findByIsbn.mockResolvedValue(null);
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.findByIsbn).toHaveBeenCalledWith('978-0132350884');
      expect(result).toMatchObject({ id: 1, title: 'Clean Code', isbn: '978-0132350884' });
    });

    it('throws ConflictException when ISBN already exists', async () => {
      const dto: CreateBookDto = {
        title: 'Duplicate',
        author: 'Someone',
        isbn: '978-0132350884',
        publishedYear: 2000,
      };
      repo.findByIsbn.mockResolvedValue(makeBook());

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('stores null for genre when genre is omitted', async () => {
      const dto: CreateBookDto = {
        title: 'No Genre',
        author: 'Author',
        isbn: '111',
        publishedYear: 2020,
      };
      const entity = makeBook({ genre: null });
      repo.findByIsbn.mockResolvedValue(null);
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ genre: null }),
      );
      expect(result.genre).toBeNull();
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns book when found', async () => {
      repo.findById.mockResolvedValue(makeBook());

      const result = await service.findOne(1);

      expect(result).toMatchObject({ id: 1, title: 'Clean Code' });
    });

    it('throws NotFoundException when book does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates and returns the book', async () => {
      const existing = makeBook();
      const updated = makeBook({ title: 'Updated Title' });
      const dto: UpdateBookDto = {
        title: 'Updated Title',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publishedYear: 2008,
        genre: 'Programming',
      };
      repo.findById.mockResolvedValue(existing);
      repo.findByIsbn.mockResolvedValue(existing); // same book — not a conflict
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(result.title).toBe('Updated Title');
    });

    it('throws NotFoundException when book does not exist', async () => {
      repo.findById.mockResolvedValue(null);
      const dto: UpdateBookDto = {
        title: 'x',
        author: 'x',
        isbn: 'abc',
        publishedYear: 2000,
      };

      await expect(service.update(999, dto)).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when ISBN belongs to a different book', async () => {
      const existing = makeBook({ id: 1 });
      const other = makeBook({ id: 2, isbn: '978-conflicting' });
      const dto: UpdateBookDto = {
        title: 'x',
        author: 'x',
        isbn: '978-conflicting',
        publishedYear: 2000,
      };
      repo.findById.mockResolvedValue(existing);
      repo.findByIsbn.mockResolvedValue(other);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });

    it('allows updating with the same ISBN as the book being updated', async () => {
      const existing = makeBook({ id: 1 });
      const dto: UpdateBookDto = {
        title: 'New Title',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publishedYear: 2008,
      };
      repo.findById.mockResolvedValue(existing);
      repo.findByIsbn.mockResolvedValue(existing); // same book
      repo.save.mockResolvedValue(makeBook({ title: 'New Title' }));

      const result = await service.update(1, dto);

      expect(result.title).toBe('New Title');
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the book when found', async () => {
      const entity = makeBook();
      repo.findById.mockResolvedValue(entity);
      repo.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(entity);
    });

    it('throws NotFoundException when book does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
