import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesRepsTargetsAchivedService } from './sales-reps-targets-achived.service';
import { CreateSalesRepsTargetsAchivedDto } from './dto/create-sales-reps-targets-achived.dto';
import { UpdateSalesRepsTargetsAchivedDto } from './dto/update-sales-reps-targets-achived.dto';

@Controller('sales-reps-targets-achived')
export class SalesRepsTargetsAchivedController {
  constructor(private readonly salesRepsTargetsAchivedService: SalesRepsTargetsAchivedService) {}

  @Post()
  create(@Body() createSalesRepsTargetsAchivedDto: CreateSalesRepsTargetsAchivedDto) {
    return this.salesRepsTargetsAchivedService.insert(createSalesRepsTargetsAchivedDto);
  }

  @Get()
  findAll() {
    return this.salesRepsTargetsAchivedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesRepsTargetsAchivedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesRepsTargetsAchivedDto: UpdateSalesRepsTargetsAchivedDto) {
    return this.salesRepsTargetsAchivedService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesRepsTargetsAchivedService.remove(+id);
  }
}
