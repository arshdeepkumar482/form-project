import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { SignupStrategyEnum } from './constants';
import { PlanEnum } from '../plan/plans.constant';
import { IUser } from './user';
import { Form } from '../form/schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const defaultAttributes: Omit<User, 'name' | 'email' | 'password'> = {
      signup_strategy: SignupStrategyEnum.EMAIL_PASSWORD,
      email_verified: false,
      plan: {
        limits: {
          api_and_webhook_access: false,
          app_integrations: false,
          custom_redirect: false,
          forms: 5,
          file_attachments: false,
          cross_domain_security: false,
          submissions: 100,
        },
        end: null,
        name: PlanEnum.FREE,
        start: null,
      },
      stats: { forms: { active: 0, total: 0, inactive: 0 }, submissions: 0 },
    };
    const newUser = await new this.userModel({
      ...createUserDto,
      ...defaultAttributes,
    });

    await newUser.save();
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async getUserById(id: string): Promise<IUser> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  formAddedOrRemoved(id: string, form: Form, { deleted = false } = {}) {
    const count = deleted ? -1 : 1;
    const obj = form.enabled
      ? { 'stats.forms.active': count }
      : { 'stats.forms.inactive': count };

    return this.userModel.findByIdAndUpdate(id, {
      $inc: { 'stats.forms.total': count, ...obj },
    });
  }

  formEnabledDisabled(id: string, oldForm: Form, updateForm: Form) {
    if (oldForm.enabled === updateForm.enabled) return;
    const inactiveCount = oldForm.enabled && !updateForm.enabled ? 1 : -1;
    const activeCount = updateForm.enabled && !oldForm.enabled ? 1 : -1;

    return this.userModel.findByIdAndUpdate(id, {
      $inc: {
        'stats.forms.active': activeCount,
        'stats.forms.inactive': inactiveCount,
      },
    });
  }
}
