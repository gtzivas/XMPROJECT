import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const bookResponse = (): BookResponseDto => ({
  id: 1,
  title: 'Clean Code',
  author: 'Robert Martin',
  isbn: '978-0132350884',
  publishedYear: 2008,
  genre: 'Programming',
});

describe('BooksController', () => {
  let controller: BooksController;
  let service: jest.Mocked<BooksService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<BooksService>;

    controller = new BooksController(service);
  });

  // ─── GET /books ───────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all books', async () => {
      service.findAll.mockResolvedValue([bookResponse()]);

      const result = await controller.findAll({} as QueryBooksDto);

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no books', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll({} as QueryBooksDto);

      expect(result).toEqual([]);
    });

    it('passes query parameters to service', async () => {
      const query: QueryBooksDto = { genre: 'Programming', author: 'Robert Martin' };
      service.findAll.mockResolvedValue([bookResponse()]);

      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  // ─── POST /books ──────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates and returns the book', async () => {
      const dto: CreateBookDto = {
        title: 'Clean Code',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publishedYear: 2008,
        genre: 'Programming',
      };
      service.create.mockResolvedValue(bookResponse());

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject({ id: 1, title: 'Clean Code' });
    });

    it('propagates ConflictException from service', async () => {
      service.create.mockRejectedValue(new ConflictException('Duplicate ISBN'));

      await expect(
        controller.create({} as CreateBookDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── GET /books/:id ───────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns a book by id', async () => {
      service.findOne.mockResolvedValue(bookResponse());

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({ id: 1 });
    });

    it('propagates NotFoundException from service', async () => {
      service.findOne.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── PUT /books/:id ───────────────────────────────────────────────────────

  describe('update', () => {
    it('updates and returns the book', async () => {
      const dto: UpdateBookDto = {
        title: 'Updated',
        author: 'Robert Martin',
        isbn: '978-0132350884',
        publishedYear: 2009,
      };
      service.update.mockResolvedValue({ ...bookResponse(), title: 'Updated' });

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.title).toBe('Updated');
    });

    it('propagates NotFoundException from service', async () => {
      service.update.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.update(999, {} as UpdateBookDto)).rejects.toThrow(NotFoundException);
    });

    it('propagates ConflictException when ISBN belongs to another book', async () => {
      service.update.mockRejectedValue(new ConflictException('ISBN conflict'));

      await expect(controller.update(1, {} as UpdateBookDto)).rejects.toThrow(ConflictException);
    });
  });

  // ─── DELETE /books/:id ────────────────────────────────────────────────────

  describe('remove', () => {
    it('removes the book successfully', async () => {
      service.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('propagates NotFoundException from service', async () => {
      service.remove.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
