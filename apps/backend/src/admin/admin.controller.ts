import { CurrentUser } from '@kir-dev/passport-authsch';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { Roles } from '../auth/decorators/Roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { SetRoleDto } from './dto/set-role.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('config')
  getConfig() {
    return this.adminService.getConfig();
  }

  @Patch('config')
  updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    return this.adminService.updateConfig(updateConfigDto);
  }

  @Patch('users/:id/role')
  setUserRole(@Param('id', ParseIntPipe) targetId: number, @Body() setRoleDto: SetRoleDto, @CurrentUser() user: User) {
    return this.adminService.setUserRole(user.id, targetId, setRoleDto.role);
  }
}
