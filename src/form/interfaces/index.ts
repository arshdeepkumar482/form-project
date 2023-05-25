import { CreateFormDto } from '../dto/create-form.dto';

export class IForm extends CreateFormDto {
  submissions: number;
  createdAt: Date;
  updatedAt: Date;
}
