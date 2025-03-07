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
import { FORBIDDEN_EXCEPTION, INVALID_TOKEN_EXCEPTION, USER_NOTFOUND_EXCEPTION } from 'src/constants/messageConstants';
import { SalesRepService } from 'src/sales-rep/sales-rep.service';
import { Configuration } from 'src/config/config.service';
import { HOSPITAL_MARKETING_MANAGER, MARKETER, SALES_DIRECTOR } from 'src/constants/lisConstants';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private lisService: LisService,
    private readonly salesRepService: SalesRepService,
    private readonly mghDbConnections: MghDbConnections,
    private readonly mghSyncService: MghSyncService
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

        const [dlwUserDetails, mghUserDetails] = await Promise.all([
          this.lisService.getUserById(decodedToken.id),
          this.forMgh(decodedToken.id)
        ]);


        if (!dlwUserDetails && !mghUserDetails) {
          throw new CustomUnprocessableEntityException(USER_NOTFOUND_EXCEPTION);
        }

        const user: any = dlwUserDetails ? dlwUserDetails.toObject() : mghUserDetails.toObject();

        if (dlwUserDetails) {
          user.ref_id = dlwUserDetails._id.toString();
        }

        if (mghUserDetails) {
          user.mgh_ref_id = mghUserDetails._id.toString();
        }

        await this.jwtService.verify(token, {
          secret: jwtConstants.secret + user.password
        });

        request.user = user;

        if (user.user_type === MARKETER || user.user_type === HOSPITAL_MARKETING_MANAGER || user.user_type === SALES_DIRECTOR) {
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
      let salesRepData;
      if (userDetails.ref_id) {
        const queryString = `ref_id = '${userDetails.ref_id}'`;

        salesRepData = await this.salesRepService.findOneSalesRep(queryString);
      }

      if (userDetails.mgh_ref_id) {
        const queryString = `mgh_ref_id = '${userDetails.mgh_ref_id}'`;

        salesRepData = await this.salesRepService.findOneSalesRep(queryString);
      }

      let ids = [];

      if (salesRepData.length) {

        if (userDetails.user_type === MARKETER) {
          ids.push(salesRepData[0].id);

          query.sales_reps = ids;
        }


        if (userDetails.user_type === HOSPITAL_MARKETING_MANAGER) {

          const data = await this.salesRepService.findSingleManagerSalesReps(salesRepData[0].id);

          if (data.length > 0) {
            ids = data.map(e => e.id);
          }

          ids.push(salesRepData[0].id);

          query.sales_reps = ids;
        }


        if (userDetails.user_type === SALES_DIRECTOR) {
          const data = await this.salesRepService.findSingleManagerSalesReps(salesRepData[0].id);

          if (data.length) {
            const managers = data.filter(item => item.roleId === 2);

            const marketers = data.filter(item => item.roleId !== 2);

            if (managers.length) {
              const managersIds = managers.map(e => e.id);

              const data = await this.salesRepService.findMultiManagersSalesReps(managersIds);

              if (data.length) {
                const finalIds = data.map(e => e.id);
                ids = [...ids, ...finalIds];
              }

              ids = [...ids, ...managersIds];

            }


            if (marketers.length) {
              const marketersIds = marketers.map(e => e.id);
              ids = [...ids, ...marketersIds];
            }


          } else {
            ids.push(salesRepData[0].id);
          }

          query.sales_reps = ids;

        }

      }

      return query;
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }

  async forMgh(id) {
    await this.mghDbConnections.connect();
    const mghUserDetails = await this.mghSyncService.getUserById(id);

    return mghUserDetails;
  }
}
