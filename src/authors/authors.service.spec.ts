import { NotFoundException } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { BooksRepository } from '../books/books.repository';
import { AuthorEntity } from './entities/author.entity';
import { BookEntity } from '../books/entities/book.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

const makeAuthor = (overrides: Partial<AuthorEntity> = {}): AuthorEntity => {
  const a = new AuthorEntity();
  a.id = 1;
  a.name = 'Robert Martin';
  a.nationality = 'American';
  a.birthYear = 1952;
  return Object.assign(a, overrides);
};

const makeBook = (overrides: Partial<BookEntity> = {}): BookEntity => {
  const b = new BookEntity();
  b.id = 1;
  b.title = 'Clean Code';
  b.author = 'Robert Martin';
  b.isbn = '978-0132350884';
  b.publishedYear = 2008;
  b.genre = 'Programming';
  return Object.assign(b, overrides);
};

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorsRepo: jest.Mocked<AuthorsRepository>;
  let booksRepo: jest.Mocked<BooksRepository>;

  beforeEach(() => {
    authorsRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<AuthorsRepository>;

    booksRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByIsbn: jest.fn(),
      findByAuthorName: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<BooksRepository>;

    service = new AuthorsService(authorsRepo, booksRepo);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all authors with their books', async () => {
      authorsRepo.findAll.mockResolvedValue([makeAuthor()]);
      booksRepo.findByAuthorName.mockResolvedValue([makeBook()]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 1, name: 'Robert Martin' });
      expect(result[0].books).toHaveLength(1);
    });

    it('returns empty array when no authors exist', async () => {
      authorsRepo.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates and returns an author with empty books array', async () => {
      const dto: CreateAuthorDto = {
        name: 'Robert Martin',
        nationality: 'American',
        birthYear: 1952,
      };
      const entity = makeAuthor();
      authorsRepo.create.mockReturnValue(entity);
      authorsRepo.save.mockResolvedValue(entity);
      booksRepo.findByAuthorName.mockResolvedValue([]);

      const result = await service.create(dto);

      expect(result).toMatchObject({ id: 1, name: 'Robert Martin' });
      expect(result.books).toEqual([]);
    });

    it('stores null for optional fields when omitted', async () => {
      const dto: CreateAuthorDto = { name: 'Anonymous' };
      const entity = makeAuthor({ nationality: null, birthYear: null });
      authorsRepo.create.mockReturnValue(entity);
      authorsRepo.save.mockResolvedValue(entity);
      booksRepo.findByAuthorName.mockResolvedValue([]);

      await service.create(dto);

      expect(authorsRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ nationality: null, birthYear: null }),
      );
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns author with books', async () => {
      authorsRepo.findById.mockResolvedValue(makeAuthor());
      booksRepo.findByAuthorName.mockResolvedValue([makeBook()]);

      const result = await service.findOne(1);

      expect(result).toMatchObject({ id: 1, name: 'Robert Martin' });
      expect(result.books).toHaveLength(1);
    });

    it('throws NotFoundException when author does not exist', async () => {
      authorsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── findBooks ────────────────────────────────────────────────────────────

  describe('findBooks', () => {
    it('returns books belonging to the author', async () => {
      authorsRepo.findById.mockResolvedValue(makeAuthor());
      booksRepo.findByAuthorName.mockResolvedValue([makeBook(), makeBook({ id: 2, isbn: '222' })]);

      const result = await service.findBooks(1);

      expect(result).toHaveLength(2);
      expect(booksRepo.findByAuthorName).toHaveBeenCalledWith('Robert Martin');
    });

    it('throws NotFoundException when author does not exist', async () => {
      authorsRepo.findById.mockResolvedValue(null);

      await expect(service.findBooks(999)).rejects.toThrow(NotFoundException);
    });

    it('returns empty array when author has no books', async () => {
      authorsRepo.findById.mockResolvedValue(makeAuthor());
      booksRepo.findByAuthorName.mockResolvedValue([]);

      const result = await service.findBooks(1);

      expect(result).toEqual([]);
    });
  });
});
