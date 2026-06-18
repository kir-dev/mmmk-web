import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@CurrentUser() user: User) {
    return this.usersService.findAll(user);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@CurrentUser() user: User) {
    return this.usersService.findMe(user.authSchId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.usersService.findOne(id, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    // Users may only edit their own profile; admins may edit anyone.
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('Csak a saját profilodat módosíthatod.');
    }
    return this.usersService.update(id, updateUserDto);
  }
}
