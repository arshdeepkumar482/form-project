import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { UserService } from '../user/user.service';
import { PlanEnum } from '../plan/plans.constant';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Form } from './schema';
import { User } from '../user/user.schema';
import pick from 'lodash/pick';

@Injectable()
export class FormService {
  constructor(
    private userService: UserService,
    @InjectModel(Form.name) private formModel: Model<Form>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  private doesPlanAllowToCreateForm(user: User): boolean {
    return user.plan.limits.forms > user.stats.forms.total;
  }

  async create(createFormDto: CreateFormDto, userId: string) {
    const user = await this.userService.getUserById(userId);

    if (!this.doesPlanAllowToCreateForm(user)) {
      throw new ForbiddenException({
        message: `You have reached maximum limits of ${user.plan.limits.forms} forms in your plan`,
      });
    }

    let allowedKeys: Array<keyof CreateFormDto> = ['name', 'enabled'];
    switch (user.plan.name) {
      case PlanEnum.FREE:
        allowedKeys = [...allowedKeys];
        break;
      default:
        break;
    }
    const finalFormPayload: Partial<Form> = pick(createFormDto, ...allowedKeys);

    const newForm = await new this.formModel({
      ...finalFormPayload,
      userId_formName: user._id + '_' + finalFormPayload.name,
      user: user._id,
    });
    const form = await newForm.save();
    await this.userService.incrementFormCount(userId, finalFormPayload.enabled);
    return form;
  }

  findAll() {
    return `This action returns all form`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
