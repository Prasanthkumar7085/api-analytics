// import { UserService } from './../Users/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CustomForbiddenException,
  CustomUnauthorizedException,
  CustomUnprocessableEntityException,
} from 'src/helpers/exceptions';
import { jwtConstants } from 'src/constants/jwt.constants';
import { LisService } from 'src/lis/lis.service';
import { FORBIDDEN_EXCEPTION, INVALID_TOKEN_EXCEPTION, USER_NOTFOUND_EXCEPTION } from 'src/constants/messageConstants';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private lisService: LisService,
  ) { }
  async canActivate(context: ExecutionContext) {
    try {

      const request = context.switchToHttp().getRequest();
      let token = request.headers.authorization;

      if (!token) {
        throw new CustomForbiddenException(FORBIDDEN_EXCEPTION);
      }

      const decodedToken: any = await this.jwtService.decode(token);

      if (!decodedToken) {
        throw new CustomUnprocessableEntityException(INVALID_TOKEN_EXCEPTION);
      }

      const user = await this.lisService.getUserById(decodedToken.id);


      if (!user) {
        throw new CustomUnauthorizedException(USER_NOTFOUND_EXCEPTION);
      }

      await this.jwtService.verify(token, {
        secret: jwtConstants.secret + user.password
      });

      request.user = user;

      return true;

    } catch (err) {
      if (err.name === 'TokenExpiredError' && err.message === 'jwt expired') {
        // Handle invalid signature exception here
        throw new CustomUnprocessableEntityException('Token expired');
      }
      if (
        err instanceof CustomUnauthorizedException ||
        err instanceof CustomForbiddenException ||
        err instanceof CustomUnprocessableEntityException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
