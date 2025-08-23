import { PartialType } from '@nestjs/swagger';

import { CreateMembershipDto } from './create-membership.dto';

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
