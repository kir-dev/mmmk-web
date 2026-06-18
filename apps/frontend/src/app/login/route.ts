import { NextResponse } from 'next/server';

export function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3030';

  return NextResponse.redirect(new URL('/auth/login', apiUrl));
}
