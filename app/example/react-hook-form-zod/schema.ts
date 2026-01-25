import z from "zod";

export const loginSchema = z.object({
    email: z.email( { message: "Email milena" } ).min( 5, "Email pugena" ),
    password: z.string().min( 8, "Password pugena" )
}); // error message can be in { "message": ".." } or as 2nd param "..."
export type LoginType = z.infer<typeof loginSchema>;