# AGENTS.md

Authoritative technology guideline for this repository. Follow these rules for all code changes.

## Stack

- **Runtime:** Node.js
- **Language:** TypeScript (strict mode)
- **Backend:** NestJS — controller / service / repository layers
- **Persistence:** TypeORM with an in-memory SQLite database
- **Validation:** `class-validator` + `class-transformer` for DTOs
- **Testing:** Jest (unit tests with mocked dependencies) + Supertest (e2e / integration tests)
- **Front-end:** React + Vite

## TypeScript

- Strict mode is enabled. Do not disable strict compiler options.
- No `any` without explicit justification (a short inline comment stating why).
- Prefer precise return types and `readonly` where values are not reassigned.

## NestJS Architecture

- One module per feature. Keep the controller, service, repository, entity, and DTOs in the same feature folder.
- Controllers stay thin: route wiring and request/response shaping only — **no business logic**.
- All business logic lives in services.
- Repositories encapsulate data access via TypeORM.

## DTOs

- DTO properties are `readonly`.
- Validate with `class-validator` decorators (`@IsString()`, `@IsNotEmpty()`, `@IsInt()`, etc.).
- Use `class-transformer` for type coercion where needed.

## Entities

- Persistence models are TypeORM entities using `@Entity`, `@Column`, and `@PrimaryGeneratedColumn` decorators.
- Never model database tables with plain interfaces.

## Error Handling

- Handle errors with NestJS exception filters (`@Catch`).
- Throw built-in `HttpException` subclasses (`NotFoundException`, `BadRequestException`, etc.).

## Testing

Every feature ships with **both** layers:

- **Jest unit tests** — service and controller tested in isolation with all dependencies mocked.
- **Supertest integration tests** — hitting the running NestJS application over HTTP.

Cover happy paths, validation errors, and not-found / edge cases. Never weaken assertions to make a test pass.

## Naming Conventions

- **Classes & decorators:** PascalCase
- **Variables & methods:** camelCase
- **File names:** kebab-case

## Linting & Formatting

- ESLint + Prettier are enforced.
- Do not commit code with lint errors.
