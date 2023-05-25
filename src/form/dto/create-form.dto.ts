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
import mongoose from 'mongoose';

export class CreateFormDto {
  @Type(() => mongoose.Types.ObjectId)
  @IsNotEmpty()
  userId: mongoose.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IsUrl)
  domains: Array<string> = [];

  @IsUrl()
  @IsOptional()
  redirectUrl: string;

  @IsBoolean()
  enabled = true;

  @IsBoolean()
  programmatic_access = false;
}
