import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { BandService } from './band.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('band')
export class BandController {
  constructor(private readonly bandService: BandService) {}

  @Post()
  create(@Body() createBandDto: CreateBandDto) {
    return this.bandService.create(createBandDto);
  }

  @Get()
  findAll() {
    return this.bandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bandService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBandDto: UpdateBandDto) {
    return this.bandService.update(id, updateBandDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bandService.remove(id);
  }

  @Get(':id/members')
  findMembers(@Param('id', ParseIntPipe) id: number) {
    return this.bandService.findMembers(id);
  }

  @Post(':id/members/:userId')
  addMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandService.addMember(bandId, userId);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandService.removeMember(bandId, userId);
  }

  @Patch(':id/members/:userId')
  approveMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandService.approveMember(bandId, userId);
  }
}
