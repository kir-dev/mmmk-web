import { PartialType, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

/**
 * Saját profil adatai. A szerepkör szándékosan nincs benne: azt csak az admin
 * módosíthatja a PATCH /users/:id/role végponton keresztül.
 */
export class UpdateUserDto extends PartialType(PickType(User, ['fullName', 'email', 'phone'] as const)) {}
