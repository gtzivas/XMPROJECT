import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorResponseDto } from './dto/author-response.dto';
import { BookResponseDto } from '../books/dto/book-response.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { NotFoundException } from '@nestjs/common';

const authorResponse = (): AuthorResponseDto => ({
  id: 1,
  name: 'Robert Martin',
  nationality: 'American',
  birthYear: 1952,
  books: [],
});

const bookResponse = (): BookResponseDto => ({
  id: 1,
  title: 'Clean Code',
  author: 'Robert Martin',
  isbn: '978-0132350884',
  publishedYear: 2008,
  genre: 'Programming',
});

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: jest.Mocked<AuthorsService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findBooks: jest.fn(),
    } as unknown as jest.Mocked<AuthorsService>;

    controller = new AuthorsController(service);
  });

  // ─── GET /authors ─────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all authors', async () => {
      service.findAll.mockResolvedValue([authorResponse()]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no authors', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── POST /authors ────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates and returns the author', async () => {
      const dto: CreateAuthorDto = { name: 'Robert Martin', nationality: 'American' };
      service.create.mockResolvedValue(authorResponse());

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject({ id: 1, name: 'Robert Martin' });
    });
  });

  // ─── GET /authors/:id ─────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns author with books array', async () => {
      const resp = { ...authorResponse(), books: [bookResponse()] };
      service.findOne.mockResolvedValue(resp);

      const result = await controller.findOne(1);

      expect(result.books).toHaveLength(1);
    });

    it('propagates NotFoundException from service', async () => {
      service.findOne.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── GET /authors/:id/books ───────────────────────────────────────────────

  describe('findBooks', () => {
    it('returns books for the given author id', async () => {
      service.findBooks.mockResolvedValue([bookResponse()]);

      const result = await controller.findBooks(1);

      expect(service.findBooks).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });

    it('propagates NotFoundException when author is missing', async () => {
      service.findBooks.mockRejectedValue(new NotFoundException('Not found'));

      await expect(controller.findBooks(999)).rejects.toThrow(NotFoundException);
    });
  });
});
