import { PartialType } from '@nestjs/mapped-types';
import { SigninDto } from './signin-dto';

export class UpdateAuthDto extends PartialType(SigninDto) {}
