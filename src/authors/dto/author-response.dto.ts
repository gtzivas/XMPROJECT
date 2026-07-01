import { BookResponseDto } from '../../books/dto/book-response.dto';

export class AuthorResponseDto {
  readonly id!: number;
  readonly name!: string;
  readonly nationality!: string | null;
  readonly birthYear!: number | null;
  readonly books!: BookResponseDto[];
}
