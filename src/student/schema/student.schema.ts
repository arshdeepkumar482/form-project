import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoIndex: true, timestamps: true })
export class Student {
  @Prop()
  name: string;
  @Prop({ index: true, unique: true, immutable: true })
  rollNumber: number;
  @Prop()
  class: number;
  @Prop()
  gender: string;
  @Prop()
  marks: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
