import { IUser } from '../user/user';

export interface IRequest extends Request {
  user: IUser;
}
