// client side redirect
"use client";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const handleRouteChange = () => {
        // logic before route change
        if(true){ // condition, eg: check role, userstatus etc.
            router.push("/example/react-hook-form-zod");
        }
    }
    return (
        <div>
            <button onClick={ handleRouteChange }
            className="bg-purple-500 p-2 text-white rounded">
                Go to React Hook Form Zod Page
            </button>
        </div>
    );
}