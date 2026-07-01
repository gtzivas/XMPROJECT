import { IsOptional, IsString } from 'class-validator';

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  readonly genre?: string;

  @IsOptional()
  @IsString()
  readonly author?: string;
}
