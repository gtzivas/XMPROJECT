import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly author!: string;

  @IsString()
  @IsNotEmpty()
  readonly isbn!: string;

  @IsInt()
  @Min(0)
  @Max(CURRENT_YEAR)
  readonly publishedYear!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly genre?: string;
}
