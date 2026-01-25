"use client";
import { useTransition } from "react";
import { handleRouteChange } from "./action/logic";
export default function Page() {
    const [isPending, startTransition] = useTransition(); // states for async to finish
    const onClick = () => {
        startTransition( async () => { // useTransition for async server action/redirect
            await handleRouteChange(); // server action that does redirect
            });
    }
    return (
        <div>
            <button onClick={ onClick }
            disabled={ isPending}
            className="bg-blue-500 p-2 text-white rounded disabled:opacity-50">
                Go to React Hook Form Zod Page (Server Redirect)
            </button>
            {
                isPending && <p>Loading...</p>
            }
        </div>
    );
}