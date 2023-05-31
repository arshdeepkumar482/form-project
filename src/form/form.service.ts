import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { UserService } from '../user/user.service';
import { PlanEnum } from '../plan/plans.constant';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Form } from './schema';
import { IUserPlan, User } from '../user/user.schema';
import { pick } from 'lodash';
import { IForm } from './interfaces';

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

  private getAllowedFieldsToUpdateOrCreate(plan: IUserPlan) {
    let allowedFields: Array<keyof CreateFormDto> = ['name', 'enabled'];
    switch (plan.name) {
      case PlanEnum.FREE:
        allowedFields = [...allowedFields];
        break;
      default:
        break;
    }
    return allowedFields;
  }

  async create(createFormDto: CreateFormDto, userId: string) {
    const user = await this.userService.getUserById(userId);

    if (!this.doesPlanAllowToCreateForm(user)) {
      throw new ForbiddenException({
        message: `You have reached maximum limits of ${user.plan.limits.forms} forms in your plan`,
      });
    }

    const finalFormPayload: Partial<Form> = pick(
      createFormDto,
      ...this.getAllowedFieldsToUpdateOrCreate(user.plan),
    );

    const newForm = await new this.formModel({
      ...finalFormPayload,
      userId_formName: user._id + '_' + finalFormPayload.name,
      user: user._id,
    });
    const form = await newForm.save();
    await this.userService.formAddedOrRemoved(userId, newForm);
    return form;
  }

  findAllForAUser(userId: string): Promise<Array<IForm>> {
    return this.formModel.find({ user: userId });
  }

  findOne(id: string) {
    return this.formModel.findById(id);
  }

  async update(id: string, updateFormDto: UpdateFormDto) {
    const form = await this.findOne(id);

    const user = await this.userService.getUserById(form.user);

    const finalFormPayload: Partial<Form> = pick(
      updateFormDto,
      ...this.getAllowedFieldsToUpdateOrCreate(user.plan),
    );

    const updatedForm = await this.formModel.findByIdAndUpdate(
      id,
      {
        ...finalFormPayload,
        userId_formName: user._id + '_' + finalFormPayload.name,
        user: user._id,
      },
      { new: true },
    );

    await this.userService.formEnabledDisabled(user._id, form, updatedForm);
    return updatedForm;
  }

  async remove(id: string) {
    const form = await this.formModel.findByIdAndDelete(id);
    await this.userService.formAddedOrRemoved(form.user.toString(), form, {
      deleted: true,
    });
    return form;
  }
}
