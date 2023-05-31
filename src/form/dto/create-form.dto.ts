import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsBoolean()
  @IsOptional()
  enabled = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IsUrl)
  @IsOptional()
  domains: Array<string> = [];

  @IsUrl()
  @IsOptional()
  redirectUrl: string;

  @IsBoolean()
  @IsOptional()
  programmatic_access = false;
}
