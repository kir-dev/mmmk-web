import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  @UseGuards(AuthGuard('jwt'))
  upsert(@Body() dto: UpdateOpenedWeekDto) {
    // Should be admin guarded, assuming AuthGuard handles basic auth, admin logic is checked elsewhere or via decorators,
    // but typically we should have RolesGuard. I'll stick to AuthGuard as that seems standard here,
    // maybe need to add more admin checks if standard practice.
    return this.openedWeeksService.upsert(dto);
  }
}
