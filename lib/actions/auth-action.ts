//server side processing
"use server";

import { registerUser, loginUser, fetchWhoAmI, updateUserProfile } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { revalidatePath } from "next/cache";

export const handleRegister = async (formData: any) => {
    try {
        const result = (await registerUser(formData)) as any;
        if (result.success) {
            return {
                success: true,
                message: "Registration successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Registration failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Registration failed"
        }
    }
}

export const handleLogin = async (formData: any) => {
    try {
        const { rememberMe, ...loginData } = formData;
        const result = (await loginUser(loginData)) as any;
        if (result.success) {
            await setAuthToken(result.data.token, rememberMe || false);
            await setUserData(result.data.user, rememberMe || false);
            return {
                success: true,
                message: "Login successful",
                data: result.data.user
            };
        }
        return {
            success: false,
            message: result.message || "Login failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Login failed"
        }
    }
}

export const handleWhoAmI = async () => {
    try {
        const result = (await fetchWhoAmI()) as any;
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Fetching user info failed"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetching user info failed"
        };
    }
}

export const handleUpdateUserProfile = async (formData: any) => {
    try {
        const result = (await updateUserProfile(formData)) as any;
        if (result.success) {
            await setUserData(result.data);
            revalidatePath("/user/profile");
            return {
                success: true,
                message: "Profile updated successfully",
                data: result.data
            }
        }
        return {
            success: false,
            message: result.message || "Update profile failed"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update profile failed"
        }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    revalidatePath("/");
    return { success: true };
}