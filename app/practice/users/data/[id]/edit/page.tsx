export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div>Edit User Data Page {id}</div>
    );
}