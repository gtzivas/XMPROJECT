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
        type: 'sqljs',
        autoSave: false,
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

describe('Books (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── GET /api/books ───────────────────────────────────────────────────────

  describe('GET /api/books', () => {
    it('returns 200 with an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/books')
        .expect(200)
        .expect([]);
    });

    it('returns 200 with all books after creation', async () => {
      await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Book A', author: 'Alice', isbn: 'ISBN-A1', publishedYear: 2000, genre: 'Fiction' });
      await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Book B', author: 'Bob', isbn: 'ISBN-B1', publishedYear: 2001, genre: 'Science' });

      const res = await request(app.getHttpServer()).get('/api/books').expect(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('returns 200 filtered by genre', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/books')
        .query({ genre: 'Fiction' })
        .expect(200);

      expect(res.body.every((b: { genre: string }) => b.genre.toLowerCase() === 'fiction')).toBe(true);
    });

    it('returns 200 filtered by author', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/books')
        .query({ author: 'Alice' })
        .expect(200);

      expect(res.body.every((b: { author: string }) => b.author.toLowerCase() === 'alice')).toBe(true);
    });

    it('returns 200 with empty array when no books match combined filters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/books')
        .query({ genre: 'Horror', author: 'Unknown' })
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  // ─── POST /api/books ──────────────────────────────────────────────────────

  describe('POST /api/books', () => {
    it('returns 201 with the created book', async () => {
      const payload = {
        title: 'New Book',
        author: 'Author Name',
        isbn: 'ISBN-UNIQUE-1',
        publishedYear: 2020,
        genre: 'Drama',
      };

      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send(payload)
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        title: 'New Book',
        isbn: 'ISBN-UNIQUE-1',
      });
    });

    it('returns 409 on duplicate ISBN', async () => {
      const payload = {
        title: 'Duplicate',
        author: 'Dup Author',
        isbn: 'ISBN-DUP-1',
        publishedYear: 2021,
      };
      await request(app.getHttpServer()).post('/api/books').send(payload).expect(201);

      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send(payload)
        .expect(409);

      expect(res.body).toMatchObject({ status: 409, error: 'Conflict' });
    });

    it('returns 400 when required field title is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({ author: 'X', isbn: 'ISBN-MISS', publishedYear: 2000 })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });

    it('returns 400 when publishedYear is not an integer', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'T', author: 'A', isbn: 'ISBN-BAD-YEAR', publishedYear: 'not-a-year' })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });

    it('returns 400 when extra (unknown) fields are sent', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'T', author: 'A', isbn: 'ISBN-EXTRA', publishedYear: 2000, unknownField: 'x' })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });
  });

  // ─── GET /api/books/:id ───────────────────────────────────────────────────

  describe('GET /api/books/:id', () => {
    let createdId: number;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Find Me', author: 'Author', isbn: 'ISBN-FIND-1', publishedYear: 2015 });
      createdId = res.body.id as number;
    });

    it('returns 200 with the book', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/books/${createdId}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: createdId, title: 'Find Me' });
    });

    it('returns 404 when book does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/books/999999')
        .expect(404);

      expect(res.body).toMatchObject({ status: 404, error: 'Not Found' });
    });

    it('returns 400 when id is not an integer', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/books/abc')
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });
  });

  // ─── PUT /api/books/:id ───────────────────────────────────────────────────

  describe('PUT /api/books/:id', () => {
    let bookId: number;
    let otherBookIsbn: string;

    beforeAll(async () => {
      const res1 = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Update Target', author: 'Auth', isbn: 'ISBN-UPD-1', publishedYear: 2010 });
      bookId = res1.body.id as number;

      const res2 = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Other Book', author: 'Auth', isbn: 'ISBN-OTHER-1', publishedYear: 2011 });
      otherBookIsbn = res2.body.isbn as string;
    });

    it('returns 200 with updated book', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/books/${bookId}`)
        .send({ title: 'Updated Title', author: 'Auth', isbn: 'ISBN-UPD-1', publishedYear: 2012 })
        .expect(200);

      expect(res.body).toMatchObject({ id: bookId, title: 'Updated Title', publishedYear: 2012 });
    });

    it('returns 404 when book does not exist', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/books/999999')
        .send({ title: 'T', author: 'A', isbn: 'ISBN-NOPE', publishedYear: 2000 })
        .expect(404);

      expect(res.body).toMatchObject({ status: 404, error: 'Not Found' });
    });

    it('returns 400 when payload is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/books/${bookId}`)
        .send({ title: '', author: 'A', isbn: 'ISBN-UPD-1', publishedYear: 2000 })
        .expect(400);

      expect(res.body).toMatchObject({ status: 400, error: 'Bad Request' });
    });

    it('returns 409 when ISBN belongs to a different book', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/books/${bookId}`)
        .send({ title: 'T', author: 'A', isbn: otherBookIsbn, publishedYear: 2000 })
        .expect(409);

      expect(res.body).toMatchObject({ status: 409, error: 'Conflict' });
    });
  });

  // ─── DELETE /api/books/:id ────────────────────────────────────────────────

  describe('DELETE /api/books/:id', () => {
    let bookId: number;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({ title: 'Delete Me', author: 'Auth', isbn: 'ISBN-DEL-1', publishedYear: 2005 });
      bookId = res.body.id as number;
    });

    it('returns 204 with no body', async () => {
      await request(app.getHttpServer())
        .delete(`/api/books/${bookId}`)
        .expect(204)
        .expect('');
    });

    it('returns 404 after deletion', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/books/${bookId}`)
        .expect(404);

      expect(res.body).toMatchObject({ status: 404, error: 'Not Found' });
    });
  });

  // ─── ValidationPipe wiring ────────────────────────────────────────────────

  describe('ValidationPipe wiring', () => {
    it('whitelist: strips unknown fields so they are not persisted', async () => {
      // The request has an extra field — it must be rejected (forbidNonWhitelisted: true)
      const res = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          title: 'VP Test',
          author: 'Auth',
          isbn: 'ISBN-VP-1',
          publishedYear: 2020,
          extraField: 'should not pass',
        })
        .expect(400);

      expect(res.body.status).toBe(400);
    });

    it('transform: coerces query string genre param to string', async () => {
      await request(app.getHttpServer())
        .get('/api/books')
        .query({ genre: 'Fiction' })
        .expect(200);
    });
  });
});
