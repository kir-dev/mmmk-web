import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest so it doesn't throw an error if no user is found
  handleRequest(err: any, user: any) {
    // If there is an error or no user, just return null (do not throw UnauthorizedException)
    if (err || !user) {
      return null;
    }
    return user;
  }
}
