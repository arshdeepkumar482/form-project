import { PlanEnum } from '../plans.constant';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

class PlanLimitDto {
  @Number()
  submissions = 0;

  @Number()
  forms = 0;

  @Boolean()
  api_and_webhook_access = false;

  @Boolean()
  cross_domain_security = false;

  @Boolean()
  custom_redirect = false;

  @Boolean()
  file_attachments = false;

  @Boolean()
  app_integrations = false;
}

export class CreatePlanDto {
  @IsString()
  @IsEnum(PlanEnum)
  @IsNotEmpty()
  name: PlanEnum;

  @IsObject()
  limits: PlanLimitDto;

  @IsDate()
  @IsNotEmpty()
  start: Date;

  @IsDate()
  @IsNotEmpty()
  end: Date;
}
