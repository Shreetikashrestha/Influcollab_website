"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/AuthContext";

export const loginSchema = z.object(
    {
        username: z.string().min(3, { message: "Username pugena" }),
        password: z.string().min(6, { message: "Password pugena" })
    }
)

export type LoginForm = z.infer<typeof loginSchema>;

export default function Page() {
    const router = useRouter();
    const [pending, setTransition] = useTransition()
    const { checkAuth } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } }
        = useForm<LoginForm>(
            {
                resolver: zodResolver(loginSchema),
            }
        )
    
    const [error, setError] = useState("");
    const onSubmit = async (data: LoginForm) => {
        // call action here
        setError("");
        try{
            const res = await handleLogin(data);
            if(!res.success){
                throw new Error(res.message || "Login failed");
            }
            // handle redirect (optional)
            await checkAuth();
            setTransition(() => {
                router.push("/");
            });
        }catch(err:Error | any){
            setError(err.message || "Login failed");
        }
    }
    
    return (
        <div>
            { error && <div className="text-red-500">{error}</div> }
            <form onSubmit={handleSubmit(onSubmit)}
                className="mx-auto p-2 max-w-xl border">
                <div className="mt-2">
                    <label>Username</label>
                    <input {...register("username")}  className="border"/>
                    {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                </div>

                <div className="mt-2">
                    <label>Password</label>
                    <input type="password" {...register("password")} className="border" />
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                </div>


                <button type="submit" className="p-2 bg-green-500 mt-4">Submit</button>
            </form>
        </div>
    );
}