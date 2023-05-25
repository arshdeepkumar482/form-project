import { Prop, raw, Schema } from '@nestjs/mongoose';
import { SignupStrategyEnum } from './constants';
import { PlanEnum } from '../plan/plans.constant';

@Schema({ autoIndex: true, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  signup_strategy: SignupStrategyEnum;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: true })
  salt: string;

  @Prop(
    raw({
      forms: {
        total: { type: Number },
        active: { type: Number },
        inactive: { type: Number },
      },
      submissions: {
        type: Number,
      },
    }),
  )
  stats: Record<string, any>;

  @Prop(
    raw({
      name: {
        type: String,
        required: true,
        enum: Object.values(PlanEnum),
      },
      limits: {
        submissions: { type: Number, required: true },
        forms: { type: Number, required: true },
        api_and_webhook_access: { type: Boolean, required: true },
        cross_domain_security: { type: Boolean, required: true },
        custom_redirect: { type: Boolean, required: true },
        file_attachments: { type: Boolean, required: true },
        app_integrations: { type: Boolean, required: true },
      },
    }),
  )
  plan: Record<string, any>;
}
