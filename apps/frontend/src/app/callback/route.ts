import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const jwt = request.nextUrl.searchParams.get('jwt');
  if (!jwt) {
    return NextResponse.error();
  }

  const suti = cookies();
  suti.set('jwt', jwt);

  return NextResponse.redirect(new URL('/', request.nextUrl));
}
