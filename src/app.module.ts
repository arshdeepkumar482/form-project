import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: 'db',
      autoIndex: true,
    }),
    UserModule,
    // StudentModule,
    FormModule,
    // AuthModule,
    // PlanModule,
    AuthModule,
  ],
})
export class AppModule {}
