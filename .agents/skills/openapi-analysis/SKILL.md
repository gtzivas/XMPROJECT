---
name: openapi-analysis
description: 'Analyze an OpenAPI YAML contract for a NestJS/TypeScript project. Use when reviewing or breaking down an OpenAPI spec into endpoints, schemas, validation rules, and NestJS DTO/entity mappings. Does not invent endpoints.'
---

# OpenAPI Analysis

Use when analyzing an OpenAPI YAML contract for a NestJS/TypeScript project.

## Procedure

1. List endpoints, methods, path/query params, request bodies, response schemas.
2. List validation constraints and error responses; note entity relationships.
3. Map each schema to its NestJS counterpart: DTO (class-validator), entity (TypeORM), or plain type.
4. Do not invent endpoints. Document assumptions if ambiguous.

## Output Location

If saving analysis under `docs/generated/`, use `{NNN}-{YYYYMMDD}-{HHMM}-{slug}-openapi-analysis.md` (same `NNN`/date/slug rules as specs) or `{base}-openapi-analysis.md` when `base` is already known from an active spec run.

## Output Sections

- API Overview
- Endpoint Matrix
- Schema Summary (with suggested NestJS DTO / Entity mapping)
- Validation Rules (map to class-validator decorators where possible)
- Error Handling Rules
- Business Rules
- Assumptions
