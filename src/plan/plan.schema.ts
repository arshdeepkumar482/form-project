import { Prop, raw, Schema } from '@nestjs/mongoose';
import { PlanEnum } from './plans.constant';
import mongoose from 'mongoose';

@Schema({ autoIndex: true, timestamps: true })
export class Plan {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: PlanEnum;

  @Prop(
    raw({
      submissions: { type: Number, required: true },
      forms: { type: Number, required: true },
      api_and_webhook_access: { type: Boolean, required: true },
      cross_domain_security: { type: Boolean, required: true },
      custom_redirect: { type: Boolean, required: true },
      file_attachments: { type: Boolean, required: true },
      app_integrations: { type: Boolean, required: true },
    }),
  )
  limits: Record<string, any>;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;
}
