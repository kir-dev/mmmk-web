import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: User) {
    return this.reservationsService.create(createReservationDto, user);
  }

  @Get()
  async findAll(@Query('page', ParseIntPipe) page: number, @Query('page_size', ParseIntPipe) pageSize: number) {
    return this.reservationsService.findAll(page, pageSize);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.remove(id);
  }
}
