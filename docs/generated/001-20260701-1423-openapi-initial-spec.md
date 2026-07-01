# Book Library API — Technical Specification (NestJS / TypeScript)

Artifact base: 001-20260701-1423-openapi-initial

- **Source contract:** `openapi.yaml` (Book Library API, version 1.0.0)
- **Base URL:** `http://localhost:8080/api`
- **Target stack:** Node.js · TypeScript (strict) · NestJS · TypeORM (in-memory SQLite) · class-validator / class-transformer · Jest + Supertest
- **Status:** Implementation-ready specification. No production code is produced by this document.

> This document is a specification only. Implementers must follow `AGENTS.md` (controller/service/repository/entity/DTO layering, kebab-case filenames, readonly DTO properties, HttpException-based error handling, and dual Jest + Supertest test coverage).

---

## 1. API Overview

The API manages two related resources: **Books** and **Authors**. Books reference an author by name (a plain string on the `Book` schema), while `Author` optionally exposes a nested list of `books`. The `/authors/{id}/books` endpoint returns all books attributed to a given author.

### 1.1 Endpoint list

| # | Method | Path | Summary | Success | Error responses |
|---|--------|------|---------|---------|-----------------|
| 1 | GET | `/books` | List all books (optional `genre`, `author` filters) | `200` array of `Book` | — |
| 2 | POST | `/books` | Create a book | `201` `Book` | `400`, `409` |
| 3 | GET | `/books/{id}` | Get a book by ID | `200` `Book` | `404` |
| 4 | PUT | `/books/{id}` | Update an existing book | `200` `Book` | `400`, `404` |
| 5 | DELETE | `/books/{id}` | Delete a book | `204` (no body) | `404` |
| 6 | GET | `/authors` | List all authors | `200` array of `Author` | — |
| 7 | POST | `/authors` | Create an author | `201` `Author` | `400` |
| 8 | GET | `/authors/{id}` | Get an author by ID | `200` `Author` | `404` |
| 9 | GET | `/authors/{id}/books` | List books by a specific author | `200` array of `Book` | `404` |

### 1.2 Parameters

| Endpoint | Param | In | Type | Required | Notes |
|----------|-------|----|----- |----------|-------|
| GET `/books` | `genre` | query | string | no | Case-insensitive exact match filter (see assumption A5) |
| GET `/books` | `author` | query | string | no | Filter by author name (see assumption A5) |
| GET/PUT/DELETE `/books/{id}` | `id` | path | integer (int64) | yes | Numeric book id |
| GET `/authors/{id}` | `id` | path | integer (int64) | yes | Numeric author id |
| GET `/authors/{id}/books` | `id` | path | integer (int64) | yes | Numeric author id |

### 1.3 Global routing

- Global prefix `api` is configured in `main.ts` (`app.setGlobalPrefix('api')`) so routes resolve under `/api` to match the OpenAPI `servers` entry.
- A global `ValidationPipe` is enabled with `{ whitelist: true, forbidNonWhitelisted: true, transform: true }` so DTO validation and type coercion run for every request.

---

## 2. Proposed NestJS Module Structure

One module per feature. Filenames are kebab-case; classes/decorators are PascalCase.

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts        # maps HttpException -> ErrorResponse shape
│   └── dto/
│       └── error-response.dto.ts           # documents ErrorResponse contract (optional, for Swagger)
├── books/
│   ├── books.module.ts
│   ├── books.controller.ts
│   ├── books.service.ts
│   ├── books.repository.ts
│   ├── entities/
│   │   └── book.entity.ts
│   └── dto/
│       ├── create-book.dto.ts              # maps to BookRequest
│       ├── update-book.dto.ts              # maps to BookRequest (full replace, PUT)
│       ├── query-books.dto.ts              # genre / author query params
│       └── book-response.dto.ts            # maps to Book
└── authors/
    ├── authors.module.ts
    ├── authors.controller.ts
    ├── authors.service.ts
    ├── authors.repository.ts
    ├── entities/
    │   └── author.entity.ts
    └── dto/
        ├── create-author.dto.ts            # maps to AuthorRequest
        ├── author-response.dto.ts          # maps to Author
        └── author-books-response.dto.ts    # reuse BookResponseDto[]
```

### 2.1 Layer responsibilities

- **Controllers** — route wiring, param/DTO binding, HTTP status codes, response shaping. No business logic.
- **Services** — all business logic and rules (duplicate-ISBN check, author existence checks, filtering orchestration, not-found handling).
- **Repositories** — thin wrappers over TypeORM `Repository<T>` encapsulating queries (find-by-isbn, filtered find, find-by-author).
- **Entities** — TypeORM persistence models.
- **DTOs** — validated request shapes and serialized response shapes with `readonly` properties.

### 2.2 Module wiring

- `BooksModule`: `imports: [TypeOrmModule.forFeature([BookEntity])]`, declares `BooksController`, provides `BooksService` and `BooksRepository`.
- `AuthorsModule`: `imports: [TypeOrmModule.forFeature([AuthorEntity])]`, declares `AuthorsController`, provides `AuthorsService` and `AuthorsRepository`.
- `AppModule`: `TypeOrmModule.forRoot({ type: 'sqlite', database: ':memory:', entities: [BookEntity, AuthorEntity], synchronize: true })`, imports both feature modules, registers the global exception filter via `APP_FILTER`.

---

## 3. Entity Definitions (TypeORM)

### 3.1 `BookEntity` — `books/entities/book.entity.ts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | int64 | `@PrimaryGeneratedColumn()` | Auto-increment PK |
| `title` | string(255) | `@Column({ length: 255 })`, not null | Required |
| `author` | string(255) | `@Column({ length: 255 })`, not null | Author name as stored on the book (see A2) |
| `isbn` | string | `@Column({ unique: true })`, not null | Unique — drives `409` duplicate check |
| `publishedYear` | int | `@Column()`, not null | Required |
| `genre` | string \| null | `@Column({ nullable: true })` | Optional |

```
@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column()
  publishedYear: number;

  @Column({ type: 'varchar', nullable: true })
  genre: string | null;
}
```

### 3.2 `AuthorEntity` — `authors/entities/author.entity.ts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | int64 | `@PrimaryGeneratedColumn()` | Auto-increment PK |
| `name` | string(255) | `@Column({ length: 255 })`, not null | Required |
| `nationality` | string(100) \| null | `@Column({ length: 100, nullable: true })` | Optional |
| `birthYear` | int \| null | `@Column({ nullable: true })` | Optional |

```
@Entity('authors')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ type: 'int', nullable: true })
  birthYear: number | null;
}
```

### 3.3 Relationships

The OpenAPI contract couples books to authors **by name string**, not by foreign key: `Book.author` is a `string`, and `BookRequest` has no `authorId`. Therefore the canonical persistence model uses **no DB-level relation** between the two entities.

- `GET /authors/{id}/books` is resolved by: (1) load the author by id (404 if missing), then (2) `books` where `book.author = author.name`.
- `Author.books` in the response is populated the same way at serialization time; it is **not** a persisted `@OneToMany` column.

> Alternative (documented, not selected): introduce a real `@ManyToOne` relation with an `authorId` FK. Rejected because it would deviate from the contract's string-based `author` field and `BookRequest` shape. See assumption A2. If a relational model is desired, raise a change request.

---

## 4. DTOs

All DTO properties are `readonly`. Validation uses `class-validator`; coercion uses `class-transformer`.

### 4.1 `CreateBookDto` (maps to `BookRequest`) — `books/dto/create-book.dto.ts`

| Field | Type | Required | Decorators |
|-------|------|----------|------------|
| `title` | string | yes | `@IsString()` `@IsNotEmpty()` `@MaxLength(255)` |
| `author` | string | yes | `@IsString()` `@IsNotEmpty()` `@MaxLength(255)` |
| `isbn` | string | yes | `@IsString()` `@IsNotEmpty()` (see A3 for ISBN format) |
| `publishedYear` | number | yes | `@IsInt()` `@Min(0)` `@Max(currentYear)` (see A4) |
| `genre` | string | no | `@IsOptional()` `@IsString()` `@MaxLength(255)` |

### 4.2 `UpdateBookDto` (PUT — full replace) — `books/dto/update-book.dto.ts`

- PUT in the contract sends a full `BookRequest`, so `UpdateBookDto` mirrors `CreateBookDto` exactly (all required fields required). It may `extends CreateBookDto` or be declared standalone. Do **not** use `PartialType` here — PUT is a full replacement, not a patch (see A6).

### 4.3 `QueryBooksDto` — `books/dto/query-books.dto.ts`

| Field | Type | Required | Decorators |
|-------|------|----------|------------|
| `genre` | string | no | `@IsOptional()` `@IsString()` |
| `author` | string | no | `@IsOptional()` `@IsString()` |

### 4.4 `CreateAuthorDto` (maps to `AuthorRequest`) — `authors/dto/create-author.dto.ts`

| Field | Type | Required | Decorators |
|-------|------|----------|------------|
| `name` | string | yes | `@IsString()` `@IsNotEmpty()` `@MaxLength(255)` |
| `nationality` | string | no | `@IsOptional()` `@IsString()` `@MaxLength(100)` |
| `birthYear` | number | no | `@IsOptional()` `@IsInt()` `@Min(0)` `@Max(currentYear)` (see A4) |

### 4.5 Response DTOs

- `BookResponseDto` (maps to `Book`): `id`, `title`, `author`, `isbn`, `publishedYear`, `genre`. `genre` may be `null`/absent.
- `AuthorResponseDto` (maps to `Author`): `id`, `name`, `nationality`, `birthYear`, `books: BookResponseDto[]`.
- Response DTOs are plain readonly shapes used for serialization; validation decorators are not required on them.

### 4.6 Path param validation

- `id` path params are parsed and validated with `ParseIntPipe` in controllers (e.g. `@Param('id', ParseIntPipe) id: number`). A non-integer id yields `400`.

---

## 5. Error Handling

### 5.1 `ErrorResponse` contract

```
{ "error": string, "message": string, "status": number }
```

### 5.2 Global exception filter — `common/filters/http-exception.filter.ts`

- A `@Catch(HttpException)` filter serializes every thrown `HttpException` into the `ErrorResponse` shape:
  - `status` ← `exception.getStatus()`
  - `error` ← standard reason phrase for the status (e.g. `Not Found`, `Bad Request`, `Conflict`)
  - `message` ← human-readable message (or joined `class-validator` messages for `400`)
- Registered globally via `{ provide: APP_FILTER, useClass: HttpExceptionFilter }` in `AppModule`.
- A `@Catch()` (catch-all) branch may map unexpected errors to `500` with the same shape.

### 5.3 Status-to-exception mapping

| Status | Trigger | Thrown by | Notes |
|--------|---------|-----------|-------|
| `400` | DTO validation failure / non-integer `id` | `ValidationPipe` / `ParseIntPipe` → `BadRequestException` | `message` aggregates validator errors |
| `404` | Book or Author not found | `NotFoundException` (service) | Endpoints 3, 4, 5, 8, 9 |
| `409` | Duplicate ISBN on create | `ConflictException` (service) | Endpoint 2 |
| `201` | Successful create | `@HttpCode(201)` (Nest default for POST) | Endpoints 2, 7 |
| `204` | Successful delete | `@HttpCode(204)` | Endpoint 5, no body |

---

## 6. Business Rules & Validation Constraints

- **BR1 — Unique ISBN.** `POST /books` must reject a book whose `isbn` already exists with `409` (`ConflictException`). Repository provides `findByIsbn(isbn)`.
- **BR2 — ISBN on update.** `PUT /books/{id}` may keep the same ISBN. If the payload's ISBN belongs to a *different* book, respond `409` (see A7). If it matches no other book (or the same book), proceed.
- **BR3 — Book not found.** `GET/PUT/DELETE /books/{id}` on a missing id → `404`.
- **BR4 — Author not found.** `GET /authors/{id}` and `GET /authors/{id}/books` on a missing id → `404`.
- **BR5 — Filtering.** `GET /books` applies `genre` and/or `author` filters when present; combined filters are AND-ed. Absent filters return all books.
- **BR6 — Full-replace update.** `PUT /books/{id}` replaces all mutable fields (`title`, `author`, `isbn`, `publishedYear`, `genre`) from the payload; `id` is immutable.
- **BR7 — Required fields.** Enforced per DTO decorators (Section 4). Unknown/extra fields are rejected by `forbidNonWhitelisted: true` → `400`.
- **BR8 — Author linkage.** Books are linked to authors by matching `Book.author` string to `Author.name` (see A2). Creating a book does not require a pre-existing author record (see A8).

---

## 7. Test Coverage Expectations

Every feature ships **both** Jest unit tests (mocked deps) and Supertest e2e tests (HTTP against the running app). Assertions must not be weakened to pass.

### 7.1 Books

| Endpoint | Jest unit (service + controller, mocked repo) | Supertest e2e |
|----------|-----------------------------------------------|---------------|
| GET `/books` | returns all; filters by `genre`; by `author`; by both; empty result | `200` + array; `200` filtered subset |
| POST `/books` | creates + returns `Book`; throws `Conflict` on duplicate ISBN; validation error path | `201` + body; `409` duplicate; `400` missing/invalid field; `400` extra field |
| GET `/books/{id}` | returns book; throws `NotFound` | `200` found; `404` missing; `400` non-integer id |
| PUT `/books/{id}` | updates + returns; `NotFound`; `Conflict` on ISBN owned by another book | `200` updated; `404` missing; `400` invalid; `409` conflicting isbn |
| DELETE `/books/{id}` | deletes; `NotFound` | `204` no body; `404` missing |

### 7.2 Authors

| Endpoint | Jest unit | Supertest e2e |
|----------|-----------|---------------|
| GET `/authors` | returns all; empty | `200` + array |
| POST `/authors` | creates + returns; validation error | `201` + body; `400` missing `name`; `400` extra field |
| GET `/authors/{id}` | returns author (with `books`); `NotFound` | `200` found; `404` missing; `400` non-integer id |
| GET `/authors/{id}/books` | returns books by author name; `NotFound` when author missing | `200` + array; `404` missing author |

### 7.3 Cross-cutting

- Exception-filter test: asserts thrown `HttpException`s serialize to `{ error, message, status }`.
- ValidationPipe wiring test: confirms `whitelist`/`forbidNonWhitelisted`/`transform` behavior in e2e.
- Each e2e suite bootstraps a fresh in-memory SQLite database per run for isolation.

---

## 8. Assumptions (Contract Ambiguities)

- **A1 — Global prefix.** The `servers` URL ends in `/api`; assumed implemented via `app.setGlobalPrefix('api')`. Port `8080` is illustrative for local dev.
- **A2 — Author linkage is by name string.** `Book.author` is a string and `BookRequest` has no `authorId`, so books are associated to authors by matching `Book.author` to `Author.name`. No FK relation is modeled. (Flagged as the most significant ambiguity.)
- **A3 — ISBN format.** The contract types `isbn` as a bare `string` with no pattern. Assumed validated only as non-empty string. No ISBN-10/13 checksum validation unless a change request adds it.
- **A4 — Year ranges.** `publishedYear` and `birthYear` are plain integers with no bounds in the contract. Assumed sensible bounds (`0 ≤ year ≤ current year`) via `@Min`/`@Max`. Adjust if the contract is clarified.
- **A5 — Filter semantics.** `genre`/`author` query filters assumed case-insensitive exact match; multiple filters AND-ed. Partial/substring matching is not assumed.
- **A6 — PUT is full replace.** PUT sends a complete `BookRequest`; treated as a full replacement, not a partial patch. No PATCH endpoint exists in the contract.
- **A7 — ISBN uniqueness on update.** The contract lists `409` only for POST. Assumed that PUT also guards ISBN uniqueness against *other* books to preserve the unique constraint; documented as an assumption pending confirmation.
- **A8 — Book creation without author record.** Creating a book with an `author` name that has no matching `Author` row is allowed (no `404`/validation on author existence), since the contract defines no such rule.
- **A9 — `genre` optionality.** `genre` is absent from `BookRequest.required`, so it is optional and nullable in persistence and responses.
- **A10 — Empty-list responses.** List endpoints return `200` with an empty array (not `404`) when no records match.
- **A11 — DELETE response body.** `204` returns no body; the `404` path returns the `ErrorResponse` shape.
- **A12 — ID type.** `int64` path ids are represented as TypeScript `number` (sufficient for SQLite auto-increment in this project scope).
