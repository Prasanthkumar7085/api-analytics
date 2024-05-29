import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FORBIDDEN, INVALID_CREDENTIALS, SOMETHING_WENT_WRONG, SUCCESS_FETCHED_STATS, SUCCESS_USERS, USER_DETAILES_FETCHED, USER_NOT_ALLOWED, USER_SIGNIN_SUCCESS, USER_STATUS_ERR_MESSAGE } from 'src/constants/messageConstants';
import { MghDbConnections } from 'src/helpers/mghDbconnection';
import { MghSyncService } from 'src/mgh-sync/mgh-sync.service';
import { SigninDto } from './dto/signin.dto';
import { LisService } from './lis.service';
import { Configuration } from 'src/config/config.service';
import * as jwt from 'jsonwebtoken';
import { HOSPITAL_MARKETING_MANAGER, LAB_ADMIN, LAB_SUPER_ADMIN, MARKETER, SALES_DIRECTOR } from 'src/constants/lisConstants';
import { CsvHelper } from 'src/helpers/csvHelper';

@Controller({
  version: '1.0',
  path: 'lis',
})

export class LisController {
  constructor(
    private readonly lisService: LisService,
    private readonly mghDbConnections: MghDbConnections,
    private readonly mghSyncService: MghSyncService,
    private readonly configuration: Configuration,
    private readonly csvHelper: CsvHelper
  ) { }

  @Get("manager/:manager_id")
  async getMarketersByManager(@Param('manager_id') managerId: string, @Res() res: any) {
    try {
      const query = {
        hospital_marketing_manager: { $in: [managerId] },
        user_type: "MARKETER"
      };

      const projection = {
        first_name: -1,
        middle_name: -1,
        last_name: -1
      };

      let usersData = await this.lisService.getUsers(query, projection);

      return res.status(200).json({
        success: true,
        message: SUCCESS_USERS,
        data: usersData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }

  @Get("users/:user_id")
  async getUsersById(@Param('user_id') userId: string, @Res() res: any) {
    try {
      let userData = await this.lisService.getUserById(userId);

      return res.status(200).json({
        success: true,
        message: USER_DETAILES_FETCHED,
        data: userData
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      });
    }
  }


  @Post("signin")
  async signin(@Res() res: any, @Body() body: SigninDto) {
    try {

      const { user_name: userName, password } = body;

      const [dlwUserDetails, mghUserDetails] = await Promise.all([
        this.lisService.getUserByUserName(userName),
        this.forMgh(userName)
      ]);


      if (!dlwUserDetails && !mghUserDetails) {
        return res.status(401).json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const userDetails: any = dlwUserDetails ? dlwUserDetails : mghUserDetails;

      await this.checkUserDetails(userDetails, res, password);

      const { token, refreshToken } = await this.getUserAuthTokens(userDetails);

      const respData = {
        success: true,
        user_details: userDetails,
        access_token: token,
        refresh_token: refreshToken,
        message: USER_SIGNIN_SUCCESS,
      };
      return res.status(201).json(respData);
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }


  @Get("dlw-stats")
  async dlwStats(@Res() res: any) {
    try {

      const casesStats = await this.lisService.getCasesStats("2023-10-01T05:00:00Z");

      const csv = await this.csvHelper.convertToCsv(casesStats);
      res.header('Content-Type', 'text/csv');
      res.attachment('users.csv');
      res.send(csv);
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      });
    }
  }

  // '2024-05-28T04:00:00Z'

  async checkUserDetails(userDetails, res, password) {
    const userType = userDetails.user_type;

    if (userDetails.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: USER_STATUS_ERR_MESSAGE + userDetails.status,
        errorCode: FORBIDDEN
      });
    }

    if (userType !== LAB_ADMIN && userType !== SALES_DIRECTOR && userType !== HOSPITAL_MARKETING_MANAGER && userType !== MARKETER && userType !== LAB_SUPER_ADMIN) {
      return res.status(401).json({
        success: false,
        message: USER_NOT_ALLOWED
      });
    }

    let match = false;
    if (userDetails) {
      match = await bcrypt.compare(password, userDetails.password);

      match = match ? userDetails : null;
    }

    if (match === null) {
      return res.status(401).json({
        success: false,
        message: INVALID_CREDENTIALS
      });
    }
  }


  async forMgh(userName) {
    await this.mghDbConnections.connect();
    const mghUserDetails = await this.mghSyncService.getUserByUserName(userName);

    return mghUserDetails;
  }


  async getUserAuthTokens(userData) {
    let user = {
      id: userData._id,
      email: userData.email,
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
    };

    let tokenSecret = this.configuration.getConfig().jwt.token_secret + userData.password;
    let refreshTokenSecret = this.configuration.getConfig().jwt.refresh_token_secret + userData.password;

    const token = jwt.sign(user, tokenSecret, {
      expiresIn: this.configuration.getConfig().jwt.token_life,
    });

    const refreshToken = jwt.sign(user, refreshTokenSecret, {
      expiresIn: this.configuration.getConfig().jwt.refresh_token_life,
    });
    return {
      token,
      refreshToken,
    };
  }

}
