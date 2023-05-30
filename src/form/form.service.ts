import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { UserService } from '../user/user.service';
import { PlanEnum } from '../plan/plans.constant';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Form } from './schema';
import { User } from '../user/user.schema';

@Injectable()
export class FormService {
  constructor(
    private userService: UserService,
    @InjectModel(Form.name) private formModel: Model<Form>,
  ) {}

  doesPlanAllowToCreateForm(user: User): boolean {
    return user.plan.limits.forms === user.stats.forms.total;
  }

  async create(createFormDto: CreateFormDto, userId: string) {
    const user = await this.userService.getUserById(userId);

    if (!this.doesPlanAllowToCreateForm(user)) {
      throw new ForbiddenException({
        message: `You have reached maximum limits of ${user.plan.limits.forms} forms in your plan`,
      });
    }

    const { name } = createFormDto;
    let finalFormPayload: Partial<Form> = {
      userId_formName: userId + '_' + name,
      name,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user: userId as Types.ObjectId,
    };

    if (user.plan.name !== PlanEnum.FREE) {
      finalFormPayload = {
        ...createFormDto,
        ...finalFormPayload,
      };
    }

    const newForm = await new this.formModel(finalFormPayload);
    return newForm.save();
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
