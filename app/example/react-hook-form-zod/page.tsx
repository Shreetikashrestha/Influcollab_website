"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "./schema";

// import static assets from "app" folder
import image2 from "@/app/assets/images/image2.jpg";
// import nextjs Image tag, auto optimize
import Image from "next/image";


// export const loginSchema = z.object({
//     email: z.email( { message: "Email milena" } ).min( 5, "Email pugena" ),
//     password: z.string().min( 8, "Password pugena" )
// }); // error message can be in { "message": ".." } or as 2nd param "..."
// export type LoginType = z.infer<typeof loginSchema>;

export default function Page() {
    const {
        register, // bind input to input state
        handleSubmit, // handle form submit logic, validation
        formState: { errors , isSubmitting }, // form state, like validation errors
    } = useForm<LoginType>(
        {
            resolver: zodResolver( loginSchema ),
            values: { email: "", password: "" } // input state and initial
            //  values: { email: "", password: "xyz" } for default // input state and initial
        }
    );
    const onSubmit = async (data: LoginType) => { // data: input states from useForm 
        alert(data.email)
    }
    return (
        <div>
            {/* Asset, height, width optional */}
            <Image src={ image2 } alt="Image 2" height={ 200 } width={ 200 } />
            {/* Public, height, width required, omit "public" folder path */}
            <Image src="/images/image1.png" alt="Image 1" height={ 200 } width={ 200 } />
            
            <form onSubmit={ handleSubmit(onSubmit) }
            className="mx-auto max-w-md p-4 border rounded">  

            <div className="m-2">
                <label>Email</label>
                <input { ...register( "email", { required: "Email chaiyo" } ) } 
                className="p-2 border" />
                {
                    errors.email && // conditional rendering, if errors.email exists
                    <p className="text-red-500">{ errors.email.message }</p>
                }
                </div>  
                <button type="submit" className="bg-green-500 p-2 text-white rounded">
                    Submit 
                </button>   

            </form>
        </div>
    );
}