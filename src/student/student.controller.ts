import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';
import { isUUID } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { ParseObjectId } from './pipes/object.pipe';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    try {
      const newStudent = await this.studentService.createStudent(
        createStudentDto,
      );
      return {
        message: 'Student has been created successfully',
        newStudent,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        err.code === 11000
          ? 'Roll Number already taken'
          : 'Student not created',
        { cause: err },
      );
    }
  }

  @Put('/:id')
  async updateStudent(
    @Param('id') studentId: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    try {
      const existingStudent = await this.studentService.updateStudent(
        studentId,
        updateStudentDto,
      );
      return {
        message: 'Student has been successfully updated',
        existingStudent,
      };
    } catch (err) {
      throw new BadRequestException(err.response, { cause: err });
    }
  }

  @Get()
  async getStudents() {
    try {
      const studentData = await this.studentService.getAllStudents();
      return {
        message: 'All students data found successfully',
        studentData,
      };
    } catch (err) {
      throw new BadRequestException(err.response, { cause: err });
    }
  }

  @Get('/:id')
  async getStudent(@Param('id') studentId: string) {
    try {
      const existingStudent = await (isValidObjectId(studentId)
        ? this.studentService.getStudent(studentId)
        : this.studentService.getStudentByRoll(studentId));
      return {
        message: 'Student found successfully',
        existingStudent,
      };
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.response, { cause: err });
    }
  }

  @Delete('/:id')
  async deleteStudent(@Param('id') studentId: string) {
    try {
      const deletedStudent = await this.studentService.deleteStudent(studentId);
      return {
        message: 'Student deleted successfully',
        deletedStudent,
      };
    } catch (err) {
      throw new BadRequestException(err.response, { cause: err });
    }
  }
}
