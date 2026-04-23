import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/Roles.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
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
  create(@Body() createBandDto: CreateBandDto, @Req() req: any) {
    return this.bandsService.create(createBandDto, req.user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: any) {
    return this.bandsService.findAll(req.user);
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
  async addMember(
    @Param('id', ParseIntPipe) bandId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: any
  ) {
    if (req.user.role !== Role.ADMIN) {
      // Requesting user must be an accepted member of the band
      const isMember = await this.bandsService.isAcceptedMember(bandId, req.user.id);
      if (!isMember) {
        throw new ForbiddenException('Csak a zenekar tagjai hívhatnak meg másokat.');
      }
    }
    return this.bandsService.addMember(bandId, userId);
  }

  @Delete(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  removeMember(
    @Param('id', ParseIntPipe) bandId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: any
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('Csak magadat távolíthatod el.');
    }
    return this.bandsService.removeMember(bandId, userId);
  }

  @Patch(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  approveMember(
    @Param('id', ParseIntPipe) bandId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: any
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('Csak a saját meghívódat fogadhatod el.');
    }
    return this.bandsService.approveMember(bandId, userId);
  }
}
