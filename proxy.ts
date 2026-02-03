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
        if (user?.isInfluencer) {
            return NextResponse.redirect(new URL("/influencer", req.url));
        } else {
            return NextResponse.redirect(new URL("/brand", req.url));
        }
    }

    // 3. Role-based redirection for dashboards
    if (token && user) {
        if (pathname === "/") {
            return NextResponse.redirect(new URL(user.isInfluencer ? "/influencer" : "/brand", req.url));
        }

        if (pathname.startsWith("/influencer") && !user.isInfluencer) {
            return NextResponse.redirect(new URL("/brand", req.url));
        }

        if (pathname.startsWith("/brand") && user.isInfluencer) {
            return NextResponse.redirect(new URL("/influencer", req.url));
        }
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
        "/login",
        "/register"
    ],
};