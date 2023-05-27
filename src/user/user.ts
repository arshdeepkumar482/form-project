import { User } from './user.schema';
import { Document } from 'mongoose';
import { CreatePlanDto } from '../plan/dto/create-plan.dto';

export class IUserPlan extends CreatePlanDto {}

export interface IUserStats {
  forms: { total: number; active: number; inactive: number };
  submissions: number;
}
console.log('user', User);
// export class IUser extends User {}

export class UserDocument extends Document {}
