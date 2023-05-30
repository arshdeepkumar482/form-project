import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './schema';

@Module({
  controllers: [FormController],
  providers: [FormService],
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
  ],
})
export class FormModule {}
