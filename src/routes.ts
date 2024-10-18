import { pathToRegexp } from 'path-to-regexp';

export const publicRoutes = [
    pathToRegexp('/'),
    pathToRegexp('/detail/:id'),
    pathToRegexp('/*.jpg'),
    pathToRegexp('/*.webp'),
    pathToRegexp('/*.png'),
    pathToRegexp('/*.svg'),
];

export const authRoutes = ['/login', '/register'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/settings';

export const DEFAULT_LOGIN_PUBLIC_REDIRECT = '/';
