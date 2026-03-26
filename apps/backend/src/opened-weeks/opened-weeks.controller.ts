import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

import { UpdateOpenedWeekDto } from './dto/update-opened-week.dto';
import { OpenedWeeksService } from './opened-weeks.service';

@Controller('opened-weeks')
export class OpenedWeeksController {
  constructor(private readonly openedWeeksService: OpenedWeeksService) {}

  @Get()
  findAll() {
    return this.openedWeeksService.findAll();
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  upsert(@Body() dto: UpdateOpenedWeekDto) {
    return this.openedWeeksService.upsert(dto);
  }
}
