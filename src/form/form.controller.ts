import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { IRequest } from '../common/common.interface';
import { User } from '../common/decorators';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto, @Req() request: IRequest) {
    return this.formService.create(createFormDto, request.user._id);
  }

  @Get()
  findAllForAUser(@Req() request: IRequest) {
    const userId = request.user._id;
    return this.formService.findAllForAUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('_id') userId) {
    const form = await this.formService.findOne(id);

    // check if form belongs to user logged in
    if (form.user.toString() === userId) return form;

    throw new NotFoundException();
  }

  @Patch(':id')
  async update(
    @Body() updateFormDto: UpdateFormDto,
    @Param('id') id: string,
    @User('_id') userId: string,
  ) {
    const form = await this.formService.findOne(id);

    // form doesn't exists or  doesn't belong to user
    if (!form || form.user.toString() !== userId) throw new NotFoundException();

    return this.formService.update(id, updateFormDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const form = await this.formService.remove(id);
    console.log(form);
    if (!form) throw new NotFoundException(`Form: ${id} doesn't exists`);
    return form;
  }
}
