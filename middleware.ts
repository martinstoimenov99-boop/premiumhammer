import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// `/` redirects by Accept-Language (falls back to /en); every route is locale-prefixed.
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
