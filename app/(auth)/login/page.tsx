"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle } from "lucide-react";

import { handleLogin } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";
import RoleSelector from "@/components/RoleSelector";
import AuthInput from "@/components/AuthInput";

export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(["Influencer", "Brand"]),
    rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const { checkAuth } = useAuth();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            role: "Influencer",
            rememberMe: false,
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: LoginForm) => {
        setError("");
        try {
            const res = await handleLogin(data);
            if (!res.success) {
                throw new Error(res.message || "Login failed");
            }
            await checkAuth();
            setTransition(() => {
                router.push("/");
            });
        } catch (err: Error | any) {
            setError(err.message || "Invalid email or password. Please try again.");
        }
    };

    return (
        <AuthLayout
            title="Welcome Back!"
            subtitle="Login to continue your journey with Collab and manage your campaigns and collaborations."
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
                <p className="text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-purple-600 font-semibold hover:text-purple-700 underline-offset-4 hover:underline transition-all">
                        Sign up
                    </Link>
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <RoleSelector
                    selectedRole={selectedRole}
                    onChange={(role) => setValue("role", role)}
                />

                <AuthInput
                    label="Email"
                    icon={Mail}
                    placeholder="Enter your email"
                    type="email"
                    error={errors.email?.message}
                    register={register("email")}
                />

                <AuthInput
                    label="Password"
                    icon={Lock}
                    placeholder="Enter your password"
                    type="password"
                    error={errors.password?.message}
                    register={register("password")}
                />

                <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                            Remember me
                        </span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-auth-gradient hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mb-4"
                >
                    {pending ? "Logging in..." : "Login"}
                </button>
            </form>
        </AuthLayout>
    );
}