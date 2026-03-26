import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

import { CreateSanctionRecordDto } from './dto/create-sanction-record.dto';
import { UpdateSanctionRecordDto } from './dto/update-sanction-record.dto';
import { SanctionRecordsService } from './sanction-records.service';

@Controller('sanction-records')
export class SanctionRecordsController {
  constructor(private readonly sanctionRecordsService: SanctionRecordsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateSanctionRecordDto, @CurrentUser() user: User) {
    return this.sanctionRecordsService.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSanctionRecordDto, @CurrentUser() user: User) {
    return this.sanctionRecordsService.update(id, dto, user.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findForCurrentUser(@CurrentUser() user: User) {
    return this.sanctionRecordsService.findForCurrentUser(user.authSchId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.sanctionRecordsService.findByUserId(userId);
  }

  @Get('band/:bandId')
  async findByBandId(@Param('bandId', ParseIntPipe) bandId: number) {
    return this.sanctionRecordsService.findByBandId(bandId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.sanctionRecordsService.findAll();
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.sanctionRecordsService.delete(id, user);
  }
}
