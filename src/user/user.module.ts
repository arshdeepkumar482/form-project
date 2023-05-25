import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User, schema: StudentSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
