import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { SOMETHING_WENT_WRONG, SUCCESS_MARKETERS } from 'constants/messageConstants';
import * as fs from 'fs';
import * as path from 'path';

@Controller({
  version: '1.0',
  path: 'stats',
})
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("marketers")
  findAll(@Res() res: any) {
    try {
      const filePath = path.resolve(__dirname, '../../../src/stats/responses/allMarketers.json');
      let data = fs.readFileSync(filePath, "utf8")

      const parsedData = JSON.parse(data);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: parsedData
      })

    } catch(error){
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get("marketers-case-type")
  getMarketersByCaseTypes(@Res() res: any) {
    try {
      const filePath = path.resolve(__dirname, '../../../src/stats/responses/allMarketersCaseType.json');
      let data = fs.readFileSync(filePath, "utf8")

      const parsedData = JSON.parse(data);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: parsedData
      })

    } catch(error){
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }

  @Get(":marketer_id")
  singleMarketer(@Res() res: any) {
    try {
      const filePath = path.resolve(__dirname, '../../../src/stats/responses/singleMarketer.json');
      let data = fs.readFileSync(filePath, "utf8")

      const parsedData = JSON.parse(data);

      return res.status(200).json({
        success: true,
        message: SUCCESS_MARKETERS,
        data: parsedData
      })

    } catch(error){
      return res.status(500).json({
        success: false,
        message: error.message || SOMETHING_WENT_WRONG
      })
    }
  }
}
