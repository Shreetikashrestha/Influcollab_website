"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#fcfcfd]">
            <AdminHeader />
            <AdminNav />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
