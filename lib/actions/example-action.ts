import { set, success } from "zod";

export async function handleExample(){
    //simulate api delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        success: true,
        message: "Message",
        data: null
    }
}