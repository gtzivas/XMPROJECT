import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { BookEntity } from '../src/books/entities/book.entity';
import { AuthorEntity } from '../src/authors/entities/author.entity';
import { BooksModule } from '../src/books/books.module';
import { AuthorsModule } from '../src/authors/authors.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [BookEntity, AuthorEntity],
        synchronize: true,
        dropSchema: true,
      }),
      BooksModule,
      AuthorsModule,
    ],
    providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  await app.init();
  return app;
}

describe('Authors (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── GET /api/authors ─────────────────────────────────────────────────────

  describe('GET /api/authors', () => {
    it('returns 200 with empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/authors')
        .expect(200)
        .expect([]);
    });

    it('returns 200 with authors after creation', async () => {
      await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: 'Robert Martin', nationality: 'American' });

      const res = await request(app.getHttpServer()).get('/api/authors').expect(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toMatchObject({ name: 'Robert Martin' });
    });
  });

  // ─── POST /api/authors ────────────────────────────────────────────────────

  describe('POST /api/authors', () => {
    it('returns 201 with the created author and empty books array', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: 'Kent Beck', nationality: 'American', birthYear: 1961 })
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        name: 'Kent Beck',
        nationality: 'American',
        birthYear: 1961,
        books: [],
      });
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ nationality: 'British' })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });

    it('returns 400 when extra (unknown) fields are sent', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: 'Extra Author', unknownField: 'x' })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });
  });

  // ─── GET /api/authors/:id ─────────────────────────────────────────────────

  describe('GET /api/authors/:id', () => {
    let authorId: number;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: 'Find Me Author' });
      authorId = res.body.id as number;
    });

    it('returns 200 with the author and books array', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/authors/${authorId}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: authorId, name: 'Find Me Author' });
      expect(Array.isArray(res.body.books)).toBe(true);
    });

    it('returns 404 when author does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/authors/999999')
        .expect(404);

      expect(res.body).toMatchObject({ status: 404, error: 'Not Found' });
    });

    it('returns 400 when id is not an integer', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/authors/abc')
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });
  });

  // ─── GET /api/authors/:id/books ───────────────────────────────────────────

  describe('GET /api/authors/:id/books', () => {
    let authorId: number;
    const authorName = 'Books Author E2E';

    beforeAll(async () => {
      const authRes = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: authorName });
      authorId = authRes.body.id as number;

      // Create books attributed to this author
      await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Author Book 1', author: authorName, isbn: 'ISBN-AB1', publishedYear: 2010 });
      await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Author Book 2', author: authorName, isbn: 'ISBN-AB2', publishedYear: 2011 });
    });

    it('returns 200 with books belonging to the author', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/authors/${authorId}/books`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body.every((b: { author: string }) => b.author.toLowerCase() === authorName.toLowerCase())).toBe(true);
    });

    it('returns 200 with empty array when author has no books', async () => {
      const emptyAuthorRes = await request(app.getHttpServer())
        .post('/api/authors')
        .send({ name: 'No Books Author' });
      const emptyAuthorId = emptyAuthorRes.body.id as number;

      const res = await request(app.getHttpServer())
        .get(`/api/authors/${emptyAuthorId}/books`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('returns 404 when author does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/authors/999999/books')
        .expect(404);

      expect(res.body).toMatchObject({ status: 404, error: 'Not Found' });
    });
  });
});
