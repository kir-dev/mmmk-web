import { PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UpdateUserRoleDto extends PickType(User, ['role'] as const) {}
