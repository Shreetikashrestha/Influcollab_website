"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle } from "lucide-react";

import { handleRegister } from "@/lib/actions/auth-action";
import AuthLayout from "@/components/AuthLayout";
import RoleSelector from "@/components/RoleSelector";
import AuthInput from "@/components/AuthInput";

export const registerSchema = z.object({
    fullName: z.string().min(3, { message: "Full Name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(["Influencer", "Brand"]),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "Influencer",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterForm) => {
        setError("");
        // Split fullName into firstName and lastName for the backend
        const [firstName, ...lastNameParts] = data.fullName.trim().split(" ");
        const lastName = lastNameParts.join(" ") || firstName;

        // Create a username from email if not provided (existing schema had username)
        const username = data.email.split("@")[0] + Math.floor(Math.random() * 1000);

        const submissionData = {
            ...data,
            firstName,
            lastName,
            username,
            confirmPassword: data.password, // Existing schema required confirmPassword
            isInfluencer: data.role === "Influencer",
        };

        try {
            const res = await handleRegister(submissionData);
            if (!res.success) {
                throw new Error(res.message || "Registration failed");
            }
            setTransition(() => {
                router.push("/login");
            });
        } catch (err: Error | any) {
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <AuthLayout
            title="Join the Future of Influencer Marketing"
            subtitle="Create your account and start building authentic partnerships and measurable results."
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign Up</h2>
                <p className="text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700 underline-offset-4 hover:underline transition-all">
                        Login
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
                    label="Full Name"
                    icon={User}
                    placeholder="Enter your name"
                    type="text"
                    error={errors.fullName?.message}
                    register={register("fullName")}
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

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-auth-gradient hover:opacity-90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mb-6"
                >
                    {pending ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-slate-400 leading-relaxed px-4">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-slate-600 font-medium hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-slate-600 font-medium hover:underline">Privacy Policy</Link>
                </p>
            </form>
        </AuthLayout>
    );
}