import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FILE_UPLOAD, SOMETHING_WENT_WRONG } from 'src/constants/messageConstants';
import { RevenueStatsHelpers } from 'src/helpers/revenuStatsHelper';

@Controller({
  version: '1.0',
  path: 'revenue-stats',
})
export class RevenueStatsController {
  constructor(
    private readonly revenueStatsHelpers: RevenueStatsHelpers
  ) { }


  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: memoryStorage()
    }),
  )
  async processRawCsvFile(@UploadedFile() file, @Req() req: any, @Res() res: any) {
    try {

     const jsonData = await this.revenueStatsHelpers.covertCsvToJson(file);

      return res.status(200).json({
        success: true,
        message: FILE_UPLOAD,
        data: jsonData
      });
    } catch (err) {
      console.log("err", err)
      return res.status(500).json({
        success: false,
        message: err.message || SOMETHING_WENT_WRONG,
      });
    }
  }


}
