import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IJwtTokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const { password: p, ...result } = user.toJSON();
    const jwtPayload: IJwtTokenPayload = {
      email: result.email,
      _id: result._id.toString(),
    };
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      ...result,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
