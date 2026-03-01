"use server"
import { cookies } from "next/headers"

export const setAuthToken = async (token: string, rememberMe: boolean = false) => {
    const cookieStore = await cookies();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    cookieStore.set({ 
        name: "auth_token", 
        value: token,
        maxAge: maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
}
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}
export const setUserData = async (userData: any, rememberMe: boolean = false) => {
    const cookieStore = await cookies();
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    cookieStore.set({ 
        name: "user_data", 
        value: JSON.stringify(userData),
        maxAge: maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
}
export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        // convert string to object -> JSON.parse
        return JSON.parse(userData);
    }
    return null;
}
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}