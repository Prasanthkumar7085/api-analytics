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
import { FORBIDDEN_EXCEPTION, HOSPITAL_MARKETING_MANAGER, INVALID_TOKEN_EXCEPTION, MARKETER, USER_NOTFOUND_EXCEPTION } from 'src/constants/messageConstants';
import { SalesRepServiceV3 } from 'src/sales-rep-v3/sales-rep-v3.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private lisService: LisService,
    private readonly salesRepService: SalesRepServiceV3
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

      if (user.user_type === MARKETER || user.user_type === HOSPITAL_MARKETING_MANAGER) {
        const query = this.addQueryBySalesRep(user, request.query);

        request.query = query;
      }

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


  async addQueryBySalesRep(userDetails, query) {
    try {
      const refId = userDetails._id.toString();

      let salesRepData = await this.salesRepService.findOneSalesRep(refId);

      if (salesRepData.length > 0 && userDetails.user_type === HOSPITAL_MARKETING_MANAGER) {
        const data = await this.salesRepService.findSingleManagerSalesReps(salesRepData[0].reportingTo);

        if (data.length > 0) {
          const ids = data.map(e => e.id);

          query.sales_reps = ids;
        }
      }

      return query;
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
