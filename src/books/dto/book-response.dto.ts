export class BookResponseDto {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly publishedYear: number;
  readonly genre: string | null;
}
