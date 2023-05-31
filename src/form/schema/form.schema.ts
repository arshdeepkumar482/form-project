import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/user.schema';

@Schema({ autoIndex: true, timestamps: true })
export class Form {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  userId_formName: string;

  @Prop({ default: [] })
  domains: Array<string>;

  @Prop()
  redirectUrl: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: false })
  programmatic_access: boolean;

  @Prop({ default: 0 })
  submission: number;
}

const _FormSchema = SchemaFactory.createForClass(Form);

_FormSchema.pre('save', function (next) {
  // to remove duplicate domains from list
  const set = {};
  this.domains.forEach((domain: string) => {
    set[domain] = 1;
  });

  this.domains = Object.keys(set);
  next();
});

export const FormSchema = _FormSchema;
