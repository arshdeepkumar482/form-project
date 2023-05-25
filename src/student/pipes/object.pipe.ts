import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectId implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return isValidObjectId(value);
  }
}
