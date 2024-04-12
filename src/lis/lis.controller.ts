import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { LisService } from './lis.service';
import { CreateLiDto } from './dto/create-li.dto';
import { UpdateLiDto } from './dto/update-li.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_USERS, USER_DETAILES_FETCHED, USER_SIGNIN_SUCCESS } from 'src/constants/messageConstants';

@Controller({
  version: '1.0',
  path: 'lis',
})

export class LisController {
  constructor(private readonly lisService: LisService) { }

  @Get("manager/:manager_id")
  async getMarketersByManager(@Param('manager_id') managerId: string, @Res() res: any) {
    try {
      const query = {
        hospital_marketing_manager: { $in: [managerId] },
        user_type: "MARKETER"
      }

      const projection = {
        first_name: -1,
        middle_name: -1,
        last_name: -1
      }

      let usersData = await this.lisService.getUsers(query, projection);

      return res.status(200).json({
        success: true,
        message: SUCCESS_USERS,
        data: usersData
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
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
      })
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG
      })
    }
  }


  @Post("signin")
  async signin(@Res() res: any){
    try {

      return res.status(200).json({
        success: true,
        message: USER_SIGNIN_SUCCESS
      })
    } catch(err){
      console.log({err});
      return res.status(500).json({
        success: false,
        message: err || SOMETHING_WENT_WRONG
      })
    }
  }
}
