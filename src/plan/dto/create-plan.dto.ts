import { PlanEnum } from '../plans.constant';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class PlanLimitDto {
  @IsNumber()
  submissions = 0;

  @IsNumber()
  forms = 0;

  @IsBoolean()
  api_and_webhook_access = false;

  @IsBoolean()
  cross_domain_security = false;

  @IsBoolean()
  custom_redirect = false;

  @IsBoolean()
  file_attachments = false;

  @IsBoolean()
  app_integrations = false;
}

export class CreatePlanDto {
  @IsString()
  @IsEnum(PlanEnum)
  @IsOptional()
  name: PlanEnum = PlanEnum.FREE;

  @IsObject()
  limits: PlanLimitDto;

  @IsDate()
  @IsNotEmpty()
  start: Date;

  @IsDate()
  @IsNotEmpty()
  end: Date;
}
