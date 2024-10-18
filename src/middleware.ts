import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import authConfig from './auth.config';
import {
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    authRoutes,
    DEFAULT_LOGIN_PUBLIC_REDIRECT,
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth(async (req): Promise<any> => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoutes = publicRoutes.some((parttern) => parttern.test(nextUrl.pathname));
    const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
    const isAdmin = req.auth?.user.role === process.env.SECRET_ROLE;

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoutes) {
        if (isApiAuthRoute) {
            return null;
        }

        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return null;
    }

    if (!isLoggedIn && !isPublicRoutes) {
        return NextResponse.redirect(new URL(`/login`, nextUrl));
    }

    if (!isAdmin && !isPublicRoutes) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_PUBLIC_REDIRECT, nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
