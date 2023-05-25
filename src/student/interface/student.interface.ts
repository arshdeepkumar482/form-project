import { Document } from 'mongoose';
export interface IStudent extends Document {
  readonly name: string;
  readonly rollNumber: number;
  readonly class: number;
  readonly gender: GenderEnum;
  readonly marks: number;
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}
