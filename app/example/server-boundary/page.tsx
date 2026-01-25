import { handleExample } from "@/lib/actions/example-action";
//page can be async
export default async function Page(){
    const result = await handleExample();
    if(result.success){
        throw new Error("Error");
    }

    return (
        <div>
            Example Server Boundary 
        </div>
    )
}