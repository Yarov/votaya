import { clerkMiddleware } from '@clerk/nextjs/server';
import { clerkConfig } from './clerk.config.js';

export default clerkMiddleware(clerkConfig);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
};
