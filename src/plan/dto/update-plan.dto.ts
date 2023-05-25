import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';

export class UpdatePlanDto extends OmitType(PartialType(CreatePlanDto), [
  'name',
]) {}
