import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/auth';

const protectedRoutes = ['/', '/dashboard', '/profile']; // Define protected routes here
const publicRoutes = ['/login', '/signup']; // Define public routes that should be accessible without authentication

export default async function middleware(request: NextRequest) {
    const session = await auth();
    const currentPath = request.nextUrl.pathname;

    //if is logged in and is trying to access /login or /signup, redirect to /
    console.log('session', session, session && (currentPath === '/login' || currentPath === '/signup'));
    if (session && (currentPath === '/login' || currentPath === '/signup')) {
        const homeURL = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(homeURL);
    }

    // Allow access to public routes even if not authenticated
    if (publicRoutes.includes(currentPath)) {
        return NextResponse.next();
    }

    // Check if the current route is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

    // If the user is not authenticated and is trying to access a protected route, redirect to /login
    if (!session && isProtectedRoute) {
        const loginURL = new URL('/login', request.nextUrl.origin);
        return NextResponse.redirect(loginURL);
    }

    return NextResponse.next();
}

// Config to apply middleware on all routes except static files, _next, and api
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
