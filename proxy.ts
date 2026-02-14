import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password"];

export default async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // 1. If no user/token & trying to access private path -> redirect to login
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. If logged in & trying to access public path (login/register) -> redirect to home/dashboard
    if (token && isPublicPath) {
        if (user?.role === 'admin') {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        if (user?.isInfluencer) {
            return NextResponse.redirect(new URL("/influencer", req.url));
        } else {
            return NextResponse.redirect(new URL("/brand", req.url));
        }
    }

    // 3. Role-based redirection for dashboards
    if (token && user) {
        if (pathname === "/") {
            if (user.role === 'admin') {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            return NextResponse.redirect(new URL(user.isInfluencer ? "/influencer" : "/brand", req.url));
        }

        if (pathname.startsWith("/influencer") && !user.isInfluencer) {
            return NextResponse.redirect(new URL("/brand", req.url));
        }

        if (pathname.startsWith("/brand") && user.isInfluencer) {
            return NextResponse.redirect(new URL("/influencer", req.url));
        }

        // 4. Admin route protection - only admin role can access
        if (pathname.startsWith("/admin")) {
            if (user.role !== 'admin') {
                // Redirect non-admin users to their appropriate dashboard
                return NextResponse.redirect(new URL(user.isInfluencer ? "/influencer" : "/brand", req.url));
            }
        }

        // 5. User route protection - any logged in user can access
        // Already handled by the initial auth check, but explicitly noted here
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/brand/:path*",
        "/influencer/:path*",
        "/campaigns/:path*",
        "/messages/:path*",
        "/user/:path*",
        "/admin/:path*",
        "/login",
        "/register"
    ],
};