import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/user.schema';

@Schema({ autoIndex: true, timestamps: true })
export class Form {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  domains: Array<string> = [];

  @Prop()
  redirectUrl: string;

  @Prop()
  enabled = true;

  @Prop()
  programmatic_access = false;
}

const _FormSchema = SchemaFactory.createForClass(Form);

_FormSchema.pre('save', function (next) {
  const set = {};
  this.domains.forEach((domain: string) => {
    set[domain] = 1;
  });

  this.domains = Object.keys(set);
  next();
});

export const FormSchema = _FormSchema;
