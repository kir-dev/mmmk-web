import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const suti = cookies();
  suti.delete('jwt');

  return NextResponse.redirect(new URL('/', request.nextUrl));
}
