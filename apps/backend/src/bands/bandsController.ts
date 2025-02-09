import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Post()
  create(@Body() createBandDto: CreateBandDto) {
    return this.bandsService.create(createBandDto);
  }

  @Get()
  findAll() {
    return this.bandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBandDto: UpdateBandDto) {
    return this.bandsService.update(id, updateBandDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.remove(id);
  }

  @Get(':id/members')
  findMembers(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.findMembers(id);
  }

  @Post(':id/members/:userId')
  addMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandsService.addMember(bandId, userId);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandsService.removeMember(bandId, userId);
  }

  @Patch(':id/members/:userId')
  approveMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandsService.approveMember(bandId, userId);
  }
}
