import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { GenderEnum } from '../interface/student.interface';
export class CreateStudentDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  readonly rollNumber: number;

  @IsNumber()
  @IsNotEmpty()
  readonly class: number;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  readonly gender: string;
  @IsNumber()
  @IsNotEmpty()
  readonly marks: number;
}
