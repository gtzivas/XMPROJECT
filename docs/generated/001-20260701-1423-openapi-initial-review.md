# Review Report: 001-20260701-1423-openapi-initial

Spec reviewed: [docs/generated/001-20260701-1423-openapi-initial-spec.md](docs/generated/001-20260701-1423-openapi-initial-spec.md)

## 1) Prioritized Findings

### Critical

1. Strict TypeScript build is currently broken by DTO property initialization rules.
- Evidence:
  - [src/books/dto/book-response.dto.ts#L1](src/books/dto/book-response.dto.ts#L1) through [src/books/dto/book-response.dto.ts#L7](src/books/dto/book-response.dto.ts#L7) define readonly properties without definite assignment.
  - [src/authors/dto/author-response.dto.ts#L3](src/authors/dto/author-response.dto.ts#L3) through [src/authors/dto/author-response.dto.ts#L8](src/authors/dto/author-response.dto.ts#L8) same issue.
  - [src/common/dto/error-response.dto.ts#L1](src/common/dto/error-response.dto.ts#L1) through [src/common/dto/error-response.dto.ts#L4](src/common/dto/error-response.dto.ts#L4) same issue.
  - `npm run build` reports TS2564 errors for these files under strict mode.
- Impact: Violates strict-mode expectation and prevents successful build output.

2. TypeScript compiler option value is invalid for current toolchain.
- Evidence:
  - [tsconfig.json#L13](tsconfig.json#L13) sets `ignoreDeprecations` to `"6.0"`.
  - `npm run build` reports TS5103: Invalid value for `--ignoreDeprecations`.
- Impact: Build failure independent of runtime behavior.

### Important

1. Persistence driver does not match the spec/stack requirement wording (in-memory SQLite).
- Evidence:
  - [src/app.module.ts#L13](src/app.module.ts#L13) configures TypeORM with `type: 'sqljs'`.
  - [test/books.e2e-spec.ts#L16](test/books.e2e-spec.ts#L16) and [test/authors.e2e-spec.ts#L16](test/authors.e2e-spec.ts#L16) also use `sqljs`.
  - Spec stack and module wiring call for in-memory SQLite.
- Impact: Contract-to-implementation drift at infrastructure level; behavior may be close, but not identical to sqlite driver semantics.

2. Unit-test matrix from section 7 is mostly met, but validation-error paths are only covered in e2e, not unit tests.
- Evidence:
  - Books unit tests in [src/books/books.controller.spec.ts](src/books/books.controller.spec.ts) and [src/books/books.service.spec.ts](src/books/books.service.spec.ts) do not exercise DTO validation error handling directly.
  - Authors unit tests in [src/authors/authors.controller.spec.ts](src/authors/authors.controller.spec.ts) and [src/authors/authors.service.spec.ts](src/authors/authors.service.spec.ts) similarly omit validation-error path checks.
  - Validation failures are covered in e2e (for example [test/books.e2e-spec.ts#L139](test/books.e2e-spec.ts#L139), [test/authors.e2e-spec.ts#L87](test/authors.e2e-spec.ts#L87)).
- Impact: Section 7 explicitly expects validation error path coverage in unit layer as well as e2e.

### Nice to have

1. Error-shape e2e assertions often check only `status` and `error`, not consistently `message`.
- Evidence:
  - Examples: [test/books.e2e-spec.ts#L136](test/books.e2e-spec.ts#L136), [test/books.e2e-spec.ts#L192](test/books.e2e-spec.ts#L192), [test/authors.e2e-spec.ts#L132](test/authors.e2e-spec.ts#L132).
  - Filter unit tests do assert message behavior in [src/common/filters/http-exception.filter.spec.ts#L23](src/common/filters/http-exception.filter.spec.ts#L23).
- Impact: Lower confidence that external API responses always preserve full `{ error, message, status }` in all paths.

## 2) Confirmed Passes (Compliant Areas)

1. Endpoint parity exists for all 9 spec paths/methods.
- Books controller routes match spec in [src/books/books.controller.ts#L19](src/books/books.controller.ts#L19).
- Authors controller routes match spec in [src/authors/authors.controller.ts#L15](src/authors/authors.controller.ts#L15).

2. Controller/service/repository layering is properly separated.
- Controllers are thin delegation layers: [src/books/books.controller.ts#L23](src/books/books.controller.ts#L23), [src/authors/authors.controller.ts#L19](src/authors/authors.controller.ts#L19).
- Business rules are in services (not found, conflict, full replace): [src/books/books.service.ts#L32](src/books/books.service.ts#L32), [src/books/books.service.ts#L54](src/books/books.service.ts#L54), [src/authors/authors.service.ts#L41](src/authors/authors.service.ts#L41).
- Data access is in repositories: [src/books/books.repository.ts#L18](src/books/books.repository.ts#L18), [src/authors/authors.repository.ts#L11](src/authors/authors.repository.ts#L11).

3. DTO validation/decorator usage for request DTOs is aligned.
- Book request constraints: [src/books/dto/create-book.dto.ts#L13](src/books/dto/create-book.dto.ts#L13).
- PUT full-replace approach (extends create DTO) is aligned with spec assumption: [src/books/dto/update-book.dto.ts#L8](src/books/dto/update-book.dto.ts#L8).
- Query DTO optional filters: [src/books/dto/query-books.dto.ts#L3](src/books/dto/query-books.dto.ts#L3).
- Author request constraints: [src/authors/dto/create-author.dto.ts#L13](src/authors/dto/create-author.dto.ts#L13).

4. Entity decorators and schema constraints are aligned.
- Book entity with unique ISBN and nullable genre: [src/books/entities/book.entity.ts#L11](src/books/entities/book.entity.ts#L11), [src/books/entities/book.entity.ts#L18](src/books/entities/book.entity.ts#L18).
- Author entity optional nationality/birthYear: [src/authors/entities/author.entity.ts#L11](src/authors/entities/author.entity.ts#L11).

5. Global validation and routing are correctly configured.
- Global prefix `/api`: [src/main.ts#L8](src/main.ts#L8).
- ValidationPipe with whitelist + forbidNonWhitelisted + transform: [src/main.ts#L10](src/main.ts#L10).

6. Exception filter response shape is implemented correctly.
- Filter constructs `{ error, message, status }`: [src/common/filters/http-exception.filter.ts#L23](src/common/filters/http-exception.filter.ts#L23).
- Message aggregation for validator arrays: [src/common/filters/http-exception.filter.ts#L43](src/common/filters/http-exception.filter.ts#L43).
- Filter behavior is unit-tested: [src/common/filters/http-exception.filter.spec.ts#L20](src/common/filters/http-exception.filter.spec.ts#L20).

7. Section 7 e2e coverage is broadly present for books and authors.
- Books e2e matrix is strongly covered in [test/books.e2e-spec.ts](test/books.e2e-spec.ts).
- Authors e2e matrix is strongly covered in [test/authors.e2e-spec.ts](test/authors.e2e-spec.ts).

## 3) Residual Risk / Test Gaps

1. Build pipeline risk remains high until strict TypeScript build issues are fixed.
2. Driver mismatch (`sqljs` vs in-memory sqlite wording in spec) may hide database-specific behavior differences.
3. Unit-level validation-path tests are lighter than section 7 expectation, reducing isolation confidence around validation-related behavior.
4. E2E error-shape assertions are not consistently validating `message`, so full contract shape coverage is uneven in integration tests.

## 4) Overall Assessment

Implementation is functionally close to the API contract and architecture requirements, with good layering and endpoint behavior. The primary blockers are strict-mode/build failures and one spec-level infrastructure mismatch. Once those are addressed, conformance should be high.
