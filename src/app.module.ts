import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { FormModule } from './form/form.module';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: 'db',
      autoIndex: true,
    }),
    // StudentModule,
    // FormModule,
    // AuthModule,
    // PlanModule,
    UserModule,
  ],
})
export class AppModule {}
