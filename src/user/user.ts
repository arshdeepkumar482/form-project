import { User } from './user.schema';
import { Document } from 'mongoose';
import { CreatePlanDto } from '../plan/dto/create-plan.dto';

export class IUser extends User {
  _id: string;
}
