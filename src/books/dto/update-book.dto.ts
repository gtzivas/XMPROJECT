import { CreateBookDto } from './create-book.dto';

/**
 * PUT sends a complete BookRequest, so UpdateBookDto is a full replacement
 * that mirrors CreateBookDto exactly (see spec assumption A6). PartialType is
 * intentionally not used because PUT is not a partial patch.
 */
export class UpdateBookDto extends CreateBookDto {}
