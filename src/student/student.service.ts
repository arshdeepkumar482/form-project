import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentDocument } from './interface/student.interface';
import { Student } from './schema/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentDocument> {
    const newStudent = await new this.studentModel(createStudentDto);
    return newStudent.save();
  }
  async updateStudent(
    studentId: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDocument> {
    const existingStudent = await this.studentModel.findByIdAndUpdate(
      studentId,
      updateStudentDto,
      { new: true },
    );
    if (!existingStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return existingStudent;
  }
  async getAllStudents(): Promise<StudentDocument[]> {
    const studentData = await this.studentModel.find();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!studentData || studentData.length == 0) {
      throw new NotFoundException('Students data not found!');
    }
    return studentData;
  }
  async getStudent(studentId: string): Promise<StudentDocument> {
    const existingStudent = await this.studentModel.findById(studentId).exec();
    if (!existingStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return existingStudent;
  }
  async getStudentByRoll(rollNumber: string): Promise<StudentDocument> {
    const existingStudent = await this.studentModel
      .findOne({ rollNumber })
      .exec();
    if (!existingStudent) {
      throw new NotFoundException(
        `Student with Roll No. #${rollNumber} not found`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return existingStudent;
  }
  async deleteStudent(studentId: string): Promise<StudentDocument> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return deletedStudent;
  }
}
