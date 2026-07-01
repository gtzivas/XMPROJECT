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

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly nationality?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(CURRENT_YEAR)
  readonly birthYear?: number;
}
