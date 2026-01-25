"use server";
import { redirect } from "next/navigation";

export async function handleRouteChange() {
    await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) ); // simulate async logic
    if(true){ // condition, eg: check role, userstatus etc.
        redirect("/example/react-hook-form-zod"); // from server
     }
}