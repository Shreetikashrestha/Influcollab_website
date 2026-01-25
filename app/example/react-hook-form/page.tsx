"use client";
import { useForm } from "react-hook-form";
export default function Page() {
    const {
        register, // bind input to input state
        handleSubmit, // handle form submit logic, validation
        formState: { errors , isSubmitting }, // form state, like validation errors
    } = useForm(
        {
            values: { email: "", password: "" } // input state and initial
        }
    );
    const onSubmit = async (data: any) => { // data: input states from useForm 
        alert(data.email)
    }
    return (
        <div>
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