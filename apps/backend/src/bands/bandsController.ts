import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) // Ha JWT-t használsz
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBandDto: UpdateBandDto) {
    return this.bandsService.update(id, updateBandDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.remove(id);
  }

  @Get(':id/members')
  findMembers(@Param('id', ParseIntPipe) id: number) {
    return this.bandsService.findMembers(id);
  }

  @Post(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  addMember(@Param('id', ParseIntPipe) bandId: number, @CurrentUser() user: User) {
    return this.bandsService.addMember(bandId, user.id);
  }

  @Delete(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  removeMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandsService.removeMember(bandId, userId);
  }

  @Patch(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  approveMember(@Param('id', ParseIntPipe) bandId: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.bandsService.approveMember(bandId, userId);
  }
}
