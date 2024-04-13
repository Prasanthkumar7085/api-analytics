// import { UserService } from './../Users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { Configuration } from 'src/config/config.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private lisService: LisService,
    private readonly salesRepService: SalesRepService,
  ) { }
  async canActivate(context: ExecutionContext) {
    try {

      const request = context.switchToHttp().getRequest();
      let token = request.headers.authorization;


      let authKey: any = request.headers["ls-auth-key"];

      if (!authKey && !token) {
        throw new CustomForbiddenException(FORBIDDEN_EXCEPTION);
      }

      if (authKey) {
        const parts = authKey.split(' ');
        const apiKey = parts[1];

        const configuration = new Configuration(new ConfigService());

        const { ls_api_key } = configuration.getConfig();

        if (ls_api_key !== apiKey) {
          throw new CustomForbiddenException(FORBIDDEN_EXCEPTION);
        }
        return true;

      }


      if (token) {
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

      }

      return false;




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
