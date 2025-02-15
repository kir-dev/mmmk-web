import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';

import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  async findAll() {
    return this.membershipsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membershipsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipsService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.membershipsService.remove(id);
  }
}
