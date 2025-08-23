import { OmitType } from '@nestjs/swagger';

import { ClubMembership } from '../entities/membership.entity';

export class CreateMembershipDto extends OmitType(ClubMembership, ['id']) {}
