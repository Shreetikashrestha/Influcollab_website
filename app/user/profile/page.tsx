import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateForm from "./_components/UpdateForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const response = await handleWhoAmI();


    if (!response.success) {
        throw new Error("failed to fetch user data");
    }
    if (!response.data) {
        notFound();
    }
    return (
        <div>
            <UpdateForm user={response.data} />

        </div>
    );
}
